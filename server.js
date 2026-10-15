/**
 * 《你在他心里是什么位置？》兑换码门禁服务
 *
 * 职责：
 *  1. 托管静态页面（index.html / app.js / styles.css / assets）
 *  2. POST /api/redeem  —— 校验兑换码，签发 24 小时有效的测试 token
 *  3. POST /api/result  —— 校验 token，服务端计分并返回结果文案（付费内容只存在服务端）
 *
 * 运行：
 *  node server.js            # 启动服务，默认 http://localhost:4173
 *  node server.js gen 20     # 生成 20 个新兑换码，追加到 codes.json
 *
 * 发码流程：生成码 → 用户在小红书付款 → 你把未使用的码发给买家 → 买家输码开测。
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4173;
const ROOT = __dirname;
// Zeabur 等平台挂持久卷时，设 DATA_DIR=/data 即可让码库和 token 在重启后不丢
const DATA_DIR = process.env.DATA_DIR || ROOT;
const CODES_FILE = path.join(DATA_DIR, 'codes.json');
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // token 有效期 24 小时，期间可重复查看/重测

// ---------------------------------------------------------------------------
// 结果文案（付费内容，仅存在于服务端，前端无法通过查看源码获取）
// ---------------------------------------------------------------------------

const RESULT_TYPES = ['whiteMoon', 'cinnabar', 'unfinished', 'heartbeat', 'gentle', 'missed'];

const results = {
  whiteMoon: {
    name: '白月光',
    tagline: '你留下的是一种很难复制的特别。',
    copy: '你不一定是对方最接近的人，却很容易成为后来某些时刻被想起的人。你留在记忆里的，不是最喧闹的情节，而是一种干净、特别、很难被替代的感觉。',
    remember: '对方最可能记住你的气质、分寸感，以及你没有用力证明自己的样子。',
    truth: '你真正舍不得的，也许不只是对方，还有那个曾经在对方面前很特别的自己。',
    quote: '有些人不必拥有，也会一直特别。',
  },
  cinnabar: {
    name: '朱砂痣',
    tagline: '你留下的不是温柔，而是一种很深的情绪痕迹。',
    copy: '你和对方之间的情绪浓度比较高。你不一定是最适合的人，却很可能是最难完全无感的人。你带来的不是平静，而是一种即使不再联系，也偶尔会被触发的记忆。',
    remember: '对方最可能记住你们之间那些强烈、失控、靠近又推开的瞬间。',
    truth: '深刻不等于适合。你留下过痕迹，但不必再用这段关系证明自己的价值。',
    quote: '我不是放不下，只是那段故事确实很难被复制。',
  },
  unfinished: {
    name: '意难平',
    tagline: '你是那段故事里，没有被写完的结尾。',
    copy: '你们之间最明显的不是不喜欢，而是有些话没说完、有些机会没抓住，或者始终差一个真正的结局。你在对方记忆里的位置，来自那句没有说出口的“如果当时”。',
    remember: '对方最可能记住你们之间那些没有发生、却一直可以想象的可能性。',
    truth: '你想要的未必是重新开始，而是承认：那段关系当时真的对你很重要。',
    quote: '我们不是没有故事，只是故事停在了最让人想象的地方。',
  },
  heartbeat: {
    name: '心动对象',
    tagline: '你是那段关系里，真实发生过的心动。',
    copy: '你曾经真实地让对方心动过。只是这份心动未必顺利发展成关系，也可能被时间、距离或现实打断。你的存在更像一段没有完全展开的可能性。',
    remember: '对方最可能记住你让他期待过的感觉，以及和你相处时变得不太一样的自己。',
    truth: '没有走到最后，不代表那一刻的心动是假的。你可以承认它，也可以继续向前。',
    quote: '有些心动没有结果，但并不因此失去意义。',
  },
  gentle: {
    name: '温柔旧人',
    tagline: '你是想起来时，心里会变软的人。',
    copy: '你不一定是对方最忘不掉的人，却是想起来时不会讨厌的人。你代表一段曾经舒服、真诚、被认真对待过的时光，即使故事结束，也没有被否定。',
    remember: '对方最可能记住你给过的安全感、照顾和那些不需要解释的默契。',
    truth: '温柔不是输。你曾经认真对待过一段关系，这本身就是你身上很珍贵的部分。',
    quote: '谢谢你来过我的生活，也谢谢我终于学会好好爱自己。',
  },
  missed: {
    name: '错过的人',
    tagline: '你们不是没有故事，只是没有在同一个时间里。',
    copy: '你和对方之间可能有过靠近的机会，但当时的你们没有在同一个时间、同一个状态里。你不是没有被喜欢过，只是现实没有把这段关系推向下一步。',
    remember: '对方最可能记住那种“本来可以”的感觉，以及你们曾经短暂靠近的瞬间。',
    truth: '错过不一定需要追回。有些关系的意义，是让你更清楚以后想要什么。',
    quote: '我们差一点，就真的可以了。',
  },
};

// 计分权重与原前端逻辑一致：越靠后的自我判断题权重越高，减少机械平票。
const QUESTION_COUNT = 12;
const QUESTION_WEIGHTS = [1, 1.03, 1.06, 1.09, 1.12, 1.15, 1.18, 1.21, 1.24, 1.27, 1.3, 1.36];

function calculateResult(answers) {
  const score = {};
  answers.forEach((type, index) => {
    score[type] = (score[type] || 0) + QUESTION_WEIGHTS[index];
  });

  const maxScore = Math.max(...Object.values(score));
  const tiedTypes = Object.keys(score).filter((type) => Math.abs(score[type] - maxScore) < 0.0001);
  if (tiedTypes.length === 1) return tiedTypes[0];

  // 平票时以更接近“当前真实感受”的靠后答案决胜，避免固定偏向某个结果。
  for (let index = answers.length - 1; index >= 0; index -= 1) {
    if (tiedTypes.includes(answers[index])) return answers[index];
  }
  return tiedTypes[0];
}

// ---------------------------------------------------------------------------
// 兑换码与 token 的读写（文件量小，直接同步读写足够）
// ---------------------------------------------------------------------------

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function loadCodes() {
  const data = readJson(CODES_FILE, { codes: [] });
  return Array.isArray(data.codes) ? data.codes : [];
}

function saveCodes(codes) {
  writeJson(CODES_FILE, { codes });
}

function loadTokens() {
  const data = readJson(TOKENS_FILE, {});
  const now = Date.now();
  const live = {};
  for (const [token, record] of Object.entries(data)) {
    if (record && now - record.createdAt < TOKEN_TTL_MS) live[token] = record;
  }
  return live;
}

function saveTokens(tokens) {
  writeJson(TOKENS_FILE, tokens);
}

function generateCode() {
  // 8 位大写字母数字，去掉易混淆的 0/O/1/I
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i += 1) code += alphabet[bytes[i] % alphabet.length];
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

function issueToken(code) {
  const tokens = loadTokens();
  const token = crypto.randomBytes(24).toString('hex');
  tokens[token] = { code, createdAt: Date.now() };
  saveTokens(tokens);
  return token;
}

// ---------------------------------------------------------------------------
// CLI：node server.js gen <数量> 生成兑换码
// ---------------------------------------------------------------------------

function handleGenCommand() {
  const count = Number(process.argv[3]);
  if (!Number.isInteger(count) || count < 1 || count > 500) {
    console.log('用法：node server.js gen <数量>   例如：node server.js gen 20');
    process.exit(1);
  }
  const codes = loadCodes();
  const created = [];
  const existing = new Set(codes.map((item) => item.code));
  while (created.length < count) {
    const code = generateCode();
    if (existing.has(code)) continue;
    existing.add(code);
    codes.push({ code, used: false, usedAt: null });
    created.push(code);
  }
  saveCodes(codes);
  console.log(`已生成 ${count} 个兑换码（追加到 codes.json）：`);
  for (const code of created) console.log(`  ${code}`);
}

// ---------------------------------------------------------------------------
// HTTP 服务
// ---------------------------------------------------------------------------

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10 * 1024) reject(new Error('body too large'));
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/redeem' && req.method === 'POST') {
    const { code } = await readBody(req);
    const normalized = String(code || '').trim().toUpperCase();
    if (!normalized) return sendJson(res, 400, { error: '请输入兑换码' });

    const codes = loadCodes();
    const record = codes.find((item) => item.code.toUpperCase() === normalized);
    if (!record) return sendJson(res, 404, { error: '兑换码不存在，请检查后再试' });
    if (record.used) return sendJson(res, 409, { error: '这个兑换码已被使用，如需帮助请联系卖家' });

    record.used = true;
    record.usedAt = new Date().toISOString();
    saveCodes(codes);
    const token = issueToken(record.code);
    return sendJson(res, 200, { token, expiresInHours: TOKEN_TTL_MS / 3600000 });
  }

  if (pathname === '/api/result' && req.method === 'POST') {
    const { token, answers } = await readBody(req);
    const tokens = loadTokens();
    const record = tokens[String(token || '')];
    if (!record) return sendJson(res, 401, { error: '测试凭证已失效，请重新输入兑换码' });

    if (!Array.isArray(answers) || answers.length !== QUESTION_COUNT || answers.some((type) => !RESULT_TYPES.includes(type))) {
      return sendJson(res, 400, { error: '答案数据不完整，请重新完成测试' });
    }

    const type = calculateResult(answers);
    return sendJson(res, 200, { type, ...results[type] });
  }

  return sendJson(res, 404, { error: 'not found' });
}

function serveStatic(req, res, pathname) {
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(ROOT, safePath === '/' ? 'index.html' : safePath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 未命中的路径统一回退到首页（前端无路由，直接展示落地页）
      return fs.readFile(path.join(ROOT, 'index.html'), (err2, html) => {
        if (err2) {
          res.writeHead(404);
          return res.end('Not Found');
        }
        res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
        res.end(html);
      });
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function handleGenOrStart() {
  if (process.argv[2] === 'gen') return handleGenCommand();

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    try {
      if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url.pathname);
      return serveStatic(req, res, url.pathname);
    } catch (error) {
      return sendJson(res, 500, { error: '服务出错了，请稍后再试' });
    }
  });

  server.listen(PORT, () => {
    console.log(`服务已启动：http://localhost:${PORT}`);
    console.log(`兑换码池：${CODES_FILE}（node server.js gen 20 可生成新码）`);
  });
}

handleGenOrStart();
