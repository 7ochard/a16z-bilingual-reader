# a16z Bilingual Reader

一个轻量、可运行的中英双语阅读与词汇复习 MVP。React 前端 + Node API + 服务端 SQLite，使用 **ts-fsrs 5.4.2** 计算真实的间隔复习计划。

> 当前只附带原创合成示例，未抓取、翻译或导入任何真实 a16z 全文。本项目与 a16z 无隶属或背书关系。以当前已观察到的 ChatGPT `schema_version: "1.0.0"` 为主，兼容早期简化版 `1.0`；原始 JSON 值、作者数组、完整分析与空音标可无损保留。权利与修订信息在本地另加，不要求上游改格式。实际附件 schema 和第一篇正式文章仍待验证；内部协议标记保持兼容。

## 运行

需要 **Node.js 24+** 和 npm。SQLite 使用 Node 内置模块，无额外数据库服务。

```sh
npm ci
npm run seed        # 可选：导入两篇原创合成文章；重复运行安全
npm run dev         # http://127.0.0.1:5173
```

生产构建的本机预览：

```sh
npm run build
npm start           # http://127.0.0.1:3001
```

服务端默认保存到 `data/reader.sqlite`。更改位置可设置 `DATABASE_PATH=/absolute/path/reader.sqlite`。数据库不会提交到 Git。重新启动保留文章、词汇、收藏、阅读状态及复习记录；不要把项目目录放到临时环境后误认为已永久备份。

## GitHub 知识库工作流

ChatGPT 负责收集并生成结构化内容，审核后的 JSON / Markdown 保存在 `content/articles/`。SQLite 负责本地查询和私人学习状态；不会把生词进度写进 Git。当前归档只有原创合成样本。

```sh
npm run content:validate -- fixtures/synthetic-upstream-1.0.0.json
npm run content:stage -- fixtures/synthetic-upstream-1.0.0.json
# 审核通过后：npm run content:archive -- reviewed-daily-article.json
npm run content:import
npm run content:query -- experiment
```

当前目标仅为稳定的 GitHub 内容归档；公开部署、账户和跨设备访问不在本轮范围内。归档按日期、文章身份和修订号保存不可覆盖的 JSON/Markdown 对；同版本重导入不产生修改，更新须提高 revision 并显式使用 --update。暂存/归档不会自动提交或推送；真实内容须先确认质量、权利和发布授权。详见 [知识库流程](docs/knowledge-workflow.md)。未来飞书等交付渠道可复用 API / CLI，当前未接入。

## 已实现

- **Read**：逐段中英交替，英文 / 中文 / 双语模式；文章分析、原文链接、版权及导入权限说明；阅读/收藏状态
- **Vocabulary**：从英文段落选词收藏，或使用每段按钮手动输入（手机可用）；词义、原文/译文上下文快照、收藏；到期卡片与 Again/Hard/Good/Easy 评分
- **Library**：日期、主题、标题/摘要搜索；从文件导入 JSON；源内容 JSON 导出
- **导入可靠性**：全批校验、事务提交、稳定文章 ID、修订号、同版本内容冲突检测、拒绝旧版本、重导入保留学习进度
- **复习可靠性**：真正调用 ts-fsrs；服务器时间；卡片和事件同一事务；请求事件 ID 去重与乐观并发，防止重试和双击重复计分
- **数据持久化**：SQLite 外键、迁移版本、WAL、完整数据库一致性备份；保存词汇不算复习

词义来自已提供的 JSON 或手动输入，**没有在线词典/翻译 API**。UI 不会凭空生成词义。未实现账户、公开部署、多用户隔离、离线写入、自动抓取或自动推送。

## 数据与安全边界

这是**单用户本机服务**。API 只绑定 `127.0.0.1`，校验 Host/Origin，写请求要求 JSON 和专用头，不开放 CORS。默认没有身份认证，不要通过端口转发、反向代理或公开托管绕过限制。要实现手机/多电脑访问，需先加入可靠身份验证、HTTPS、授权隔离及持久磁盘备份。浏览器不是权威数据源；当前版本不声称开箱即用的云同步。

只导入自有、获许可内容，或无全文许可时原创的摘要/转述与独立分析。未经授权不得导入第三方全文。`source.rights` 和 `permission_note` 是明确的权利声明，不是自动验证工具；字段填写不会产生版权许可。源链接仅作跳转，服务端不会抓取链接。

## 检查与备份

```sh
npm run check       # TypeScript + unit/API tests + production build
npm run test:e2e    # Playwright desktop/mobile smoke tests, see docs/testing.md
npm run backup -- /absolute/path/reader-backup.sqlite
```

备份包含全部学习状态与内容。`GET /api/export` 仅导出导入的文章数据，**不等同于学习进度备份**。恢复方法见 [部署与备份](docs/deployment.md)。

## 文档

- [架构与取舍](docs/architecture.md)
- [标准导入格式与版本规则](docs/import-schema.md)
- [API 契约](docs/api-contract.md)
- [部署、持久化、备份](docs/deployment.md)
- [测试步骤与实际结果](docs/testing.md)
- [开源项目选型报告](docs/open-source-selection.zh.md)
- [第三方组件与许可证](THIRD_PARTY_NOTICES.md)

源内容样本在 `fixtures/synthetic-library.json`，UI 没有写死文章正文。当前 1.0.0 适配样本在 `fixtures/synthetic-upstream-1.0.0.json`；早期 1.0 样本在 `fixtures/synthetic-upstream-wrapper.json`。两者都保留上游字段和无段落关联的词汇例句。完整合成标准样本在 `fixtures/synthetic-daily-article.json`（含深度分析与 12 个词汇）。正式上游样本到达后，先回归测试和版权审核，再归档提交。
