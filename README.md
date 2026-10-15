# 你在他心里是什么位置？

一个面向小红书引流的恋爱情感趣味测试 H5 MVP。

## 当前已实现

- 移动端优先的落地页
- 兑换码门禁：一码一次，验证通过后签发 24 小时有效的测试 token
- 付费结果文案与计分逻辑全部在服务端（`server.js`），前端无法通过查看源码获取
- 12 道情感选择题
- 6 种结果：白月光、朱砂痣、意难平、心动对象、温柔旧人、错过的人
- 支持返回上一题，已选答案会保留并可覆盖修改
- 结果卡片 PNG 下载
- 结果文案复制
- 无第三方依赖，`node server.js` 一条命令启动（静态托管 + API）

## 本地运行

在项目目录运行：

```bash
node server.js
```

然后打开：<http://localhost:4173>

演示码：`DEMO-2026`（仅供自己走流程测试，不要发给买家）

## 发码流程（人工发码模式）

```bash
node server.js gen 20    # 生成 20 个新兑换码，追加到 codes.json 并打印
```

1. 运行上面的命令生成一批码
2. 用户在小红书下单付款
3. 把一个未使用的码发给买家
4. 买家输码开测，码随即作废（token 24 小时内可重复查看结果）

`codes.json` 中 `used: true` 的码已消耗；可据此对账。

## 部署（Zeabur，推荐起步）

代码已含 `package.json` 和 `DATA_DIR` 持久化支持，Zeabur 可直接识别部署：

1. 把项目推到 GitHub 仓库
2. 打开 [zeabur.com](https://zeabur.com) → 用 GitHub 登录 → New Project → 区域选 **Hong Kong**（大陆访问快、免备案）
3. Add Service → Git → 选这个仓库 → 自动构建部署
4. Networking 里绑定域名，得到 `xxx.zeabur.app` 网址
5. 挂持久卷（重要，否则重启丢码库）：服务 → Storage → Create Volume，挂载路径填 `/data`
6. 环境变量添加：`DATA_DIR` = `/data`
7. 打开服务的 Web Terminal，执行 `node server.js gen 20` 生成线上码库（持久卷里是全新的码库，git 里那份种子码不会自动带过去）

以后日常发码：在 Zeabur Web Terminal 里跑 `node server.js gen 20`，码库直接落在持久卷，立即生效、重启不丢。

注意：`tokens.json` 是运行时数据，已在 `.gitignore` 排除，不要提交。

## 生产接入方案

当前已实现「兑换码门禁」过渡方案（人工发码 + 服务端验证）。
下一步接入真实收款时，建议演进为自动发码三层架构：

1. **小红书笔记/商品页：** 负责内容引流与商品成交。
2. **订单服务：** 创建订单、支付回调、生成一次性测试 token。
3. **测试 H5：** 验证 token 后开放测试，提交答案并返回结果。

建议的接口形态：

```text
POST /api/orders
  -> { orderId, checkoutPayload }

POST /api/payments/notify
  -> 支付平台回调，服务端验签并把订单标记为 paid

GET /api/tests/relationship/entry?token=...
  -> 验证订单后返回测试入口

POST /api/tests/relationship/result
  -> { token, answers }
  -> { resultId, result, shareText }
```

## 价格为 ¥5 时的产品建议

- 题目数量：10–12 道
- 结果数量：6–8 种
- 每个结果：约 400–700 字
- 额外交付：结果卡、隐藏关键词、分享文案
- 真实支付上线前，先使用演示模式或人工发放测试码验证内容转化

## 合规提示

页面应明确标注：本测试为娱乐性质的情感自我探索，不代表对方真实想法、未来关系或任何专业判断。不要宣传“保证复合”“精准测出他是否还爱你”等确定性结论。
