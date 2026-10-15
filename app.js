const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const questions = [
  {
    text: '现在闭上眼睛，关于他的第一段画面更像哪一个？',
    options: [
      { text: '人很多，你隔着一段距离看见他的侧脸', type: 'whiteMoon' },
      { text: '一次争执结束后，你盯着手机等他回头', type: 'cinnabar' },
      { text: '聊天框里有一段打了很久、最后没发出去的话', type: 'unfinished' },
      { text: '你们并排吃饭或走路，聊的都是很小的事', type: 'gentle' },
      { text: '某次对视比平常久了一秒，你先移开了目光', type: 'heartbeat' },
      { text: '车站、路口或电梯门前，你看着他离开', type: 'missed' },
    ],
  },
  {
    text: '你第一次意识到“这个人对我不一样”，是哪一刻？',
    options: [
      { text: '他没回复，你发现自己一整天都被影响', type: 'cinnabar' },
      { text: '你开始在心里反复排练一个始终没问出口的问题', type: 'unfinished' },
      { text: '你很自然地把一天里最琐碎的事都讲给他听', type: 'gentle' },
      { text: '手机一亮，你会先猜是不是他的消息', type: 'heartbeat' },
      { text: '你发现彼此靠得再近，也绕不开距离或现实', type: 'missed' },
      { text: '他看见了你很少被别人注意到的那一面', type: 'whiteMoon' },
    ],
  },
  {
    text: '在这段关系里，你最常变成哪一种自己？',
    options: [
      { text: '明明在意，却总等对方先给一个明确的信号', type: 'heartbeat' },
      { text: '越害怕失去，越容易说出伤人的话', type: 'cinnabar' },
      { text: '把问题归结为时间、距离和当时的处境', type: 'missed' },
      { text: '照顾他的习惯，像照顾生活的一部分', type: 'gentle' },
      { text: '克制、体面，不愿让他看见自己的狼狈', type: 'whiteMoon' },
      { text: '反复分析一句话、一个标点、一次沉默', type: 'unfinished' },
    ],
  },
  {
    text: '下面哪个细节，你可能到现在还记得？',
    options: [
      { text: '他曾用一个只有他会用的方式形容你', type: 'whiteMoon' },
      { text: '他记得你的口味，顺手把你不喜欢的东西拿走', type: 'gentle' },
      { text: '他说过一句很重的话，你连语气都还记得', type: 'cinnabar' },
      { text: '他撤回过一条消息，而你一直想知道内容', type: 'unfinished' },
      { text: '一次已经约好的见面，最后因为现实取消了', type: 'missed' },
      { text: '他正在输入很久，最后只发来一句很普通的话', type: 'heartbeat' },
    ],
  },
  {
    text: '你们最接近改变关系的那一次，发生了什么？',
    options: [
      { text: '终于腾出的时间被临时打断，之后再也没约成', type: 'missed' },
      { text: '他看着你像想说什么，最后只是笑了一下', type: 'whiteMoon' },
      { text: '情绪最浓的时候靠得很近，冷静后又退回原位', type: 'cinnabar' },
      { text: '没有正式确认，但相处已经像生活在一起', type: 'gentle' },
      { text: '话题已经碰到核心，却被其中一个人轻轻带开', type: 'unfinished' },
      { text: '你差点说出喜欢，他也差点给出回应', type: 'heartbeat' },
    ],
  },
  {
    text: '如果一定要选，真正让故事停下来的更像什么？',
    options: [
      { text: '彼此都在等，却没人真正往前走一步', type: 'heartbeat' },
      { text: '爱和委屈混在一起，最后谁都不会好好说话', type: 'cinnabar' },
      { text: '不是不喜欢，而是生活没有给你们位置', type: 'missed' },
      { text: '没有谁做错，只是亲密慢慢变成了习惯', type: 'gentle' },
      { text: '关系结束了，但最关键的问题始终没有答案', type: 'unfinished' },
      { text: '你们更适合留在彼此想象中，而不是现实里', type: 'whiteMoon' },
    ],
  },
  {
    text: '如果你偶尔点进他的主页，真正想确认的是什么？',
    options: [
      { text: '他现在喜欢的人，身上有没有一点像你', type: 'whiteMoon' },
      { text: '这段关系是不是也曾让他难受过', type: 'cinnabar' },
      { text: '某条动态里，会不会藏着当年问题的答案', type: 'unfinished' },
      { text: '他过得好不好，仅此而已', type: 'gentle' },
      { text: '如果现在都单身，你们是否还有一点可能', type: 'heartbeat' },
      { text: '你们的人生轨迹，有没有重新靠近的迹象', type: 'missed' },
    ],
  },
  {
    text: '如果只能保留一段记忆，你最舍不得删掉哪段？',
    options: [
      { text: '那个“要是早一点就好了”的瞬间', type: 'missed' },
      { text: '他在人群中只看向你的那一眼', type: 'whiteMoon' },
      { text: '一段普通到几乎没有情节的陪伴', type: 'gentle' },
      { text: '一次让你又痛又清醒的拥抱或争吵', type: 'cinnabar' },
      { text: '你们都知道不普通，却谁也没有挑明的那段时间', type: 'heartbeat' },
      { text: '故事结束前，那场本来应该发生的谈话', type: 'unfinished' },
    ],
  },
  {
    text: '哪一句话，你最可能在深夜打出来又删掉？',
    options: [
      { text: '你后来有没有遇见一个像我的人？', type: 'whiteMoon' },
      { text: '你凭什么像什么都没发生过一样？', type: 'cinnabar' },
      { text: '我只想知道，当时你到底有没有认真过？', type: 'unfinished' },
      { text: '谢谢你，那段时间我是真的很开心', type: 'gentle' },
      { text: '如果我们不是在那个时候认识，会不会不一样？', type: 'missed' },
      { text: '其实那天，我差一点就告诉你我喜欢你', type: 'heartbeat' },
    ],
  },
  {
    text: '如果今晚他只发来一句“最近好吗”，你最可能怎么做？',
    options: [
      { text: '先问出那个压了很久的问题，再决定要不要继续聊', type: 'unfinished' },
      { text: '直接问他为什么突然出现，不想再猜', type: 'cinnabar' },
      { text: '先确认他现在的生活状态，以及联系是不是合适', type: 'missed' },
      { text: '认真回复近况，也接受谈话可能只到这里', type: 'gentle' },
      { text: '隔一会儿再回，尽量让自己显得平静而体面', type: 'whiteMoon' },
      { text: '打了很多字又删掉，只回一句“挺好的，你呢”', type: 'heartbeat' },
    ],
  },
  {
    text: '如果现在重新见面，哪件事最容易让你失去平静？',
    options: [
      { text: '他仍然记得你以前一个很小的习惯', type: 'whiteMoon' },
      { text: '他无意间用了从前争吵时的语气', type: 'cinnabar' },
      { text: '他说：“其实当时我有话没告诉你。”', type: 'unfinished' },
      { text: '你们自然地聊起来，好像中间没有隔很多年', type: 'gentle' },
      { text: '他提起当时没能解决的距离或现实', type: 'missed' },
      { text: '对视的一瞬间，你发现心动还在', type: 'heartbeat' },
    ],
  },
  {
    text: '最后诚实一次：你为什么会点开这个测试？',
    options: [
      { text: '想确认那份心动不是只有自己感受到', type: 'heartbeat' },
      { text: '想知道自己是不是也曾让他久久不能平静', type: 'cinnabar' },
      { text: '想给一段没有答案的关系找到一个名字', type: 'unfinished' },
      { text: '想确认你们输给的是时机，而不是没有爱过', type: 'missed' },
      { text: '想温柔地回看一次，然后允许自己继续生活', type: 'gentle' },
      { text: '想确认自己在他的记忆里，确实是特别的', type: 'whiteMoon' },
    ],
  },
];

// 付费文案与计分逻辑已移至服务端（server.js），前端只提交答案、渲染返回结果。
const TOKEN_KEY = 'love-test-token';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

let currentQuestion = 0;
let answers = [];
let lastResult = null; // 服务端返回的完整结果对象 { type, name, tagline, copy, remember, truth, quote }

function getToken() {
  const raw = sessionStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw);
    if (Date.now() - record.createdAt > TOKEN_TTL_MS) {
      sessionStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return record.token;
  } catch {
    sessionStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token, createdAt: Date.now() }));
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function renderLanding() {
  app.innerHTML = `
    <section class="screen">
      <div class="hero">
        <p class="eyebrow">A tiny love reading</p>
        <h1 class="serif-title">你在他心里<br />是什么位置？</h1>
        <div class="hero-ornament"></div>
        <p class="subtitle">白月光、朱砂痣、意难平，<br />还是那个差一点就在一起的人？</p>
        <div class="pill-row">
          <span class="pill">12道情感题</span>
          <span class="pill">即时出结果</span>
          <span class="pill">专属结果卡</span>
        </div>
        <button class="cta" data-action="open-redeem">输入兑换码&nbsp;&nbsp;开始测试</button>
        <p class="legal">在小红书下单后可获得兑换码。本测试为娱乐性质的情感自我探索，不代表对方真实想法或未来关系。</p>
      </div>
    </section>
  `;
}

function renderRedeem(errorMessage = '') {
  // 支持 ?code=XXXX-1234 带码链接：买家点开自动填好，直接点验证即可
  const urlCode = (new URLSearchParams(location.search).get('code') || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 9);
  app.innerHTML = `
    <section class="screen">
      <div class="panel payment-panel">
        <div class="payment-head">
          <div>
            <p class="eyebrow">Your story, your answer</p>
            <h2>输入兑换码<br />开始你的测试</h2>
          </div>
        </div>
        <ul class="bullet-list">
          <li>下单后你会收到专属兑换码</li>
          <li>每个兑换码只能使用一次，请勿外传</li>
          <li>测试开始后 24 小时内可重复查看结果</li>
        </ul>
        <div class="redeem-field">
          <input
            id="redeem-input"
            class="redeem-input ${errorMessage ? 'redeem-input-error' : ''}"
            type="text"
            inputmode="text"
            autocomplete="off"
            spellcheck="false"
            maxlength="9"
            placeholder="例如 ABCD-1234"
            value="${escapeHtml(urlCode)}"
            aria-label="兑换码"
          />
          ${urlCode && !errorMessage ? '<p class="redeem-error">已为你填入兑换码，点击下方按钮开始</p>' : ''}
          ${errorMessage ? `<p class="redeem-error">${escapeHtml(errorMessage)}</p>` : ''}
        </div>
        <button class="cta" data-action="submit-redeem">验证并开始测试</button>
        <button class="text-button" data-action="back-home">返回首页</button>
      </div>
    </section>
  `;
  const input = document.querySelector('#redeem-input');
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') redeemCode();
  });
  input.focus();
}

async function redeemCode() {
  const input = document.querySelector('#redeem-input');
  const button = document.querySelector('[data-action="submit-redeem"]');
  const code = (input ? input.value : '').trim();
  if (!code) {
    renderRedeem('请先输入兑换码');
    return;
  }
  button.disabled = true;
  button.textContent = '验证中…';
  try {
    const response = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) {
      renderRedeem(data.error || '兑换码验证失败，请稍后再试');
      return;
    }
    saveToken(data.token);
    startTest();
  } catch {
    renderRedeem('网络出错了，请检查网络后重试');
  }
}

function renderResultLoading() {
  app.innerHTML = `
    <section class="screen">
      <div class="panel result-loading-card">
        <div class="loading-stars">
          <span>✦</span><span>✦</span><span>✦</span>
        </div>
        <h2>正在生成你的情感档案…</h2>
        <p>正在对照 12 道答案，为你找到留在那段记忆里的位置。</p>
      </div>
    </section>
  `;
}

async function fetchResult() {
  const token = getToken();
  if (!token) {
    renderRedeem('你的测试凭证已失效，请重新输入兑换码');
    return;
  }
  renderResultLoading();
  try {
    const response = await fetch('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, answers }),
    });
    const data = await response.json();
    if (response.status === 401) {
      clearToken();
      renderRedeem(data.error || '你的测试凭证已失效，请重新输入兑换码');
      return;
    }
    if (!response.ok) {
      showToast(data.error || '出结果失败了，请稍后再试');
      renderQuiz();
      return;
    }
    renderResult(data);
  } catch {
    showToast('网络出错了，请稍后再试');
    renderQuiz();
  }
}

function renderQuiz() {
  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;
  app.innerHTML = `
    <section class="screen">
      <div class="quiz-header">
        <div class="quiz-meta"><span>你的情感档案</span><span>${currentQuestion + 1} / ${questions.length}</span></div>
        <div class="progress-track"><div class="progress-value" style="width: ${progress}%"></div></div>
      </div>
      <div class="panel question-card">
        <p class="eyebrow">Question ${String(currentQuestion + 1).padStart(2, '0')}</p>
        <h1>${escapeHtml(question.text)}</h1>
        <div class="option-list">
          ${question.options.map((option, index) => `
            <button class="option ${answers[currentQuestion] === option.type ? 'selected' : ''}" data-action="answer" data-type="${option.type}" aria-pressed="${answers[currentQuestion] === option.type}">
              <span class="option-index">${String.fromCharCode(65 + index)}</span>
              <span class="option-label">${escapeHtml(option.text)}</span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-actions">
          <button class="secondary previous-button" data-action="previous-question" ${currentQuestion === 0 ? 'disabled' : ''}>上一题</button>
          <span class="quiz-hint">选择后自动进入下一题</span>
        </div>
        <p class="quiz-footnote">不要选最体面的答案，选那个让你停顿最久、最像当时的你的答案。</p>
      </div>
    </section>
  `;
}

function renderResult(data = lastResult) {
  lastResult = data;
  app.innerHTML = `
    <section class="screen result-screen">
      <p class="eyebrow">Your result</p>
      <div class="panel result-card" id="result-card">
        <p class="eyebrow result-label">你更像是</p>
        <h1 class="result-name">${data.name}</h1>
        <p class="result-tagline">${data.tagline}</p>
        <div class="result-divider"></div>
        <p class="result-copy">${data.copy}</p>
        <div class="result-sections">
          <section class="mini-section"><h3>对方可能记住你的</h3><p>${data.remember}</p></section>
          <section class="mini-section"><h3>这段关系给你的提醒</h3><p>${data.truth}</p></section>
        </div>
        <p class="share-quote">${data.quote}</p>
      </div>
      <div class="result-actions">
        <button class="cta" data-action="download-card">保存我的结果卡</button>
        <button class="secondary" data-action="copy-result">复制结果文案</button>
        <button class="secondary" data-action="edit-answers">返回修改答案</button>
        <button class="text-button" data-action="restart">再测一次</button>
      </div>
      <p class="legal">本结果仅供娱乐和自我探索，不用于判断他人真实想法。</p>
    </section>
  `;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function startTest() {
  currentQuestion = 0;
  answers = [];
  renderQuiz();
}

function handleAnswer(type) {
  // 用题目下标保存答案，而不是 push；这样返回上一题时可以覆盖旧答案。
  answers[currentQuestion] = type;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuiz();
  } else {
    fetchResult();
  }
}

function goToPreviousQuestion() {
  if (currentQuestion === 0) return;
  currentQuestion -= 1;
  renderQuiz();
}

async function copyResult() {
  if (!lastResult) return;
  const text = `我的结果是：${lastResult.name}\n${lastResult.tagline}\n${lastResult.quote}\n\n《你在他心里是什么位置？》`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('结果文案已复制，去分享给闺蜜吧');
  } catch {
    showToast('当前浏览器不支持自动复制，请长按结果卡保存');
  }
}

function downloadCard() {
  const result = lastResult;
  if (!result) return;
  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = 720 * scale;
  canvas.height = 920 * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const gradient = ctx.createLinearGradient(0, 0, 720, 920);
  gradient.addColorStop(0, '#fffaf8');
  gradient.addColorStop(1, '#f4dfdf');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 720, 920);
  ctx.fillStyle = 'rgba(214,109,120,.14)';
  ctx.beginPath(); ctx.arc(610, 110, 130, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(110,64,90,.10)';
  ctx.beginPath(); ctx.arc(110, 850, 160, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#b94f67';
  ctx.font = '700 20px sans-serif';
  ctx.fillText('你的情感档案 · YOUR RESULT', 58, 78);
  ctx.fillStyle = '#6e405a';
  ctx.font = '900 88px serif';
  ctx.fillText(result.name, 54, 205);
  ctx.fillStyle = '#b94f67';
  ctx.font = '500 27px serif';
  drawWrappedText(ctx, result.tagline, 58, 264, 580, 44);
  ctx.strokeStyle = 'rgba(110,64,90,.2)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(58, 350); ctx.lineTo(662, 350); ctx.stroke();
  ctx.fillStyle = '#5e4d59';
  ctx.font = '500 25px serif';
  drawWrappedText(ctx, result.copy, 58, 407, 600, 45);
  ctx.fillStyle = '#6e405a';
  ctx.font = '600 25px serif';
  drawWrappedText(ctx, `“${result.quote}”`, 58, 755, 600, 42);
  ctx.fillStyle = '#a18e98';
  ctx.font = '500 17px sans-serif';
  ctx.fillText('娱乐性质的情感自我探索', 58, 862);

  const link = document.createElement('a');
  link.download = `你的情感档案-${result.name}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('结果卡已生成');
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  let currentY = y;
  for (const char of text) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'open-redeem') renderRedeem();
  if (action === 'submit-redeem') redeemCode();
  if (action === 'back-home') renderLanding();
  if (action === 'answer') handleAnswer(target.dataset.type);
  if (action === 'previous-question') goToPreviousQuestion();
  if (action === 'download-card') downloadCard();
  if (action === 'copy-result') copyResult();
  if (action === 'edit-answers') {
    currentQuestion = questions.length - 1;
    renderQuiz();
  }
  // 再测一次：24 小时内 token 仍有效，重新作答后 fetchResult 会再次提交。
  if (action === 'restart') startTest();
});

renderLanding();
