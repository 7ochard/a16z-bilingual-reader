# Winning the Relay Race: Long-Running Agents in High-Value Customer Journeys

赢得接力赛：高价值客户旅程中的长期运行智能体

David Haber · 2026-10-14

Article ID: a16z-2026-10-14-winning-the-relay-race · Revision: 1

Source: Andreessen Horowitz

Original URL: https://a16z.com/winning-the-relay-race-long-running-agents-in-high-value-customer-journeys/

Selected: 2026-11-02

Copyright mode: original\_summary\_only

Rights: summary\_only

Original article © 2026 Andreessen Horowitz. Original bilingual summaries, independent commentary and teaching examples only; no full-text reproduction.

No permission to reproduce the original article is claimed. This archive contains concise original summaries and separately identified independent analysis; examples are newly written, not quotations.

Topics: AI agents, Enterprise software, Customer journeys

Selection / summary: 今日重新核实官方原文并与远端归档按 URL 和标题去重。既有每日精选对话的当天正文不可读，未取得原始 JSON；本文件是独立新生成的原创学习材料，并非恢复的上游文件。

## Bilingual reading

### s01 (paragraph, order 0)

Haber argues that agents can extend beyond brief support interactions to coordinate customer journeys lasting weeks or months.

Haber 认为，智能体可以超越短时客服互动，协调持续数周或数月的客户旅程。

### s02 (paragraph, order 1)

His central commercial hypothesis is that preserving continuity across handoffs could improve final outcomes, enabling pricing tied to value rather than only labor savings.

其核心商业假设是：保持交接连续性可能改善最终结果，使定价关联价值，而不只是节省人工。

### s03 (paragraph, order 2)

The opportunity remains a hypothesis to test: technical execution alone does not settle who deserves credit or how buyers should pay.

这一机会仍需检验：技术执行本身不能解决成果归因和买方如何付费的问题。

## Analysis

原文主张以长期客户旅程而非孤立任务理解智能体价值。以下深度解读是编者独立提出的工程与评估框架，不代表作者原话或已证实结论。
- 原文采用案例推演来支持机会判断，并非对照试验；不能据此估计具体收益。
- 独立验证建议：先记录现有流程每个状态的等待时长、人工返工率和客户退出率，再定义单一可验收结果。不要把更多消息或更多工具调用当成业务改善。
- 独立验证建议：在具备同等服务保障的前提下设置可比队列，并预先确定观察窗口。分别报告完成率、投诉率、每案总成本与人工接管次数；保留失败样本，避免只展示成功故事。

### discussion

- 独立工程判断：长期执行需要可恢复的状态机，而不只是更长的提示词。每次外部写操作应带幂等标识、授权依据和可审计事件；重启后先读取状态，不能盲目重试。
- 独立产品判断：把“等待外部回应”设为正常状态，明确下一次触发条件、停止条件与责任人。客户要求停止联系时，应立即压过模型的目标追求。
- 独立商业判断：先划定供应商可控制的行为，再谈绩效定价。可控交付物可作为早期验收单位；高度受外部因素影响的最终结果不宜直接等同于模型贡献。
- 我的判断是，先证明“可安全恢复且不会重复执行”，再证明“结果有所改善”。建议从单一低风险交接点开始，使用故障注入测试断网、超时、重复事件与权限变化；通过后再延长运行周期。扩展门槛应同时包含业务效果和安全指标，不能只凭任务完成率。即使自动化在技术上成功，若客户负担或复核成本上升，也应保留回退到人工流程的选择。

### limitations

原文是投资机构人员的机会判断，不是独立效果评估。本文不提供法律、投资或采购建议。

独立风险分析：旧上下文可能比缺失上下文更危险。地址、授权及客户意愿都会改变；记忆应保留来源时间，并在重要行动前重新确认有效性。

独立风险分析：试点若只接收简单案件，会夸大表现；若忽略人工复核和失败补救成本，会低估成本。分层报告和完整成本归集比单一平均值更有解释力。

### independent judgment

我的判断是，先证明“可安全恢复且不会重复执行”，再证明“结果有所改善”。建议从单一低风险交接点开始，使用故障注入测试断网、超时、重复事件与权限变化；通过后再延长运行周期。扩展门槛应同时包含业务效果和安全指标，不能只凭任务完成率。即使自动化在技术上成功，若客户负担或复核成本上升，也应保留回退到人工流程的选择。

## Vocabulary

### outage

/ˈaʊ.t̬ɪdʒ/ · noun

服务中断

ID: up-60b0bf570917c35898a97cab · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): An outage triggered the support workflow.

一次服务中断触发了客服流程。

### mortgage

/ˈmɔːr.ɡɪdʒ/ · noun

住房抵押贷款

ID: up-50ac76fa52ea4f43c382f24a · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The mortgage application needs a final review.

这份住房抵押贷款申请需要最终审核。

### revenue

/ˈrev.ə.nuː/ · noun

业务收入

ID: up-25f98246353a5fd949bbe11a · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Higher revenue does not always mean higher profit.

收入增加并不总意味着利润增加。

### intake

/ˈɪn.teɪk/ · noun

客户初步接洽

ID: up-b011412bde1a2c38888a87a8 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The intake form records the initial request.

初步接洽表记录最初的请求。

### evidence

/ˈev.ə.dəns/ · noun

案件证据

ID: up-34c81fca2005a8c69a9af07a · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Every decision should link to its evidence.

每项决定都应关联其证据。

### persistence

/pɚˈsɪs.təns/ · noun

持续跟进的毅力

ID: up-057be9a1ca56732babbc0c06 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Persistence must respect a customer’s request to stop.

持续跟进必须尊重客户要求停止的意愿。

### reliability

/rɪˌlaɪ.əˈbɪl.ə.t̬i/ · noun

执行可靠性

ID: up-5b34322da65c59ba194869dc · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): We test reliability after a simulated restart.

我们在模拟重启后测试可靠性。

### procurement

/prəˈkjʊr.mənt/ · noun

企业采购

ID: up-a7e79fec801610ef3c61a504 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Procurement asked for a measurable acceptance criterion.

采购团队要求可衡量的验收标准。

### attribution

/ˌæt.rəˈbjuː.ʃən/ · noun

成果贡献归因

ID: up-f7f325210245b21a27356d9b · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Attribution requires a credible comparison group.

成果归因需要可信的对照组。

### compliance

/kəmˈplaɪ.əns/ · noun

合规要求

ID: up-625ed63af4ca06d764cd7eba · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Compliance checks remain necessary after automation.

自动化后仍然需要合规检查。

## Complete provenance and extensions

```json
{
  "upstream_snapshot": {
    "schema_version": "1.0.0",
    "id": "a16z-2026-10-14-winning-the-relay-race",
    "source": {
      "name": "Andreessen Horowitz",
      "domain": "a16z.com",
      "language": "en"
    },
    "title": "Winning the Relay Race: Long-Running Agents in High-Value Customer Journeys",
    "author": [
      "David Haber"
    ],
    "published_at": "2026-10-14",
    "selected_at": "2026-11-02",
    "url": "https://a16z.com/winning-the-relay-race-long-running-agents-in-high-value-customer-journeys/",
    "topics": [
      "AI agents",
      "Enterprise software",
      "Customer journeys"
    ],
    "selection_reason": "今日重新核实官方原文并与远端归档按 URL 和标题去重。既有每日精选对话的当天正文不可读，未取得原始 JSON；本文件是独立新生成的原创学习材料，并非恢复的上游文件。",
    "segments": [
      {
        "id": "s01",
        "en": "Haber argues that agents can extend beyond brief support interactions to coordinate customer journeys lasting weeks or months.",
        "zh": "Haber 认为，智能体可以超越短时客服互动，协调持续数周或数月的客户旅程。"
      },
      {
        "id": "s02",
        "en": "His central commercial hypothesis is that preserving continuity across handoffs could improve final outcomes, enabling pricing tied to value rather than only labor savings.",
        "zh": "其核心商业假设是：保持交接连续性可能改善最终结果，使定价关联价值，而不只是节省人工。"
      },
      {
        "id": "s03",
        "en": "The opportunity remains a hypothesis to test: technical execution alone does not settle who deserves credit or how buyers should pay.",
        "zh": "这一机会仍需检验：技术执行本身不能解决成果归因和买方如何付费的问题。"
      }
    ],
    "analysis": {
      "core_thesis": "原文主张以长期客户旅程而非孤立任务理解智能体价值。以下深度解读是编者独立提出的工程与评估框架，不代表作者原话或已证实结论。",
      "supporting_evidence": [
        "原文采用案例推演来支持机会判断，并非对照试验；不能据此估计具体收益。",
        "独立验证建议：先记录现有流程每个状态的等待时长、人工返工率和客户退出率，再定义单一可验收结果。不要把更多消息或更多工具调用当成业务改善。",
        "独立验证建议：在具备同等服务保障的前提下设置可比队列，并预先确定观察窗口。分别报告完成率、投诉率、每案总成本与人工接管次数；保留失败样本，避免只展示成功故事。"
      ],
      "industry_significance": [
        "独立工程判断：长期执行需要可恢复的状态机，而不只是更长的提示词。每次外部写操作应带幂等标识、授权依据和可审计事件；重启后先读取状态，不能盲目重试。",
        "独立产品判断：把“等待外部回应”设为正常状态，明确下一次触发条件、停止条件与责任人。客户要求停止联系时，应立即压过模型的目标追求。",
        "独立商业判断：先划定供应商可控制的行为，再谈绩效定价。可控交付物可作为早期验收单位；高度受外部因素影响的最终结果不宜直接等同于模型贡献。"
      ],
      "limitations": [
        "原文是投资机构人员的机会判断，不是独立效果评估。本文不提供法律、投资或采购建议。",
        "独立风险分析：旧上下文可能比缺失上下文更危险。地址、授权及客户意愿都会改变；记忆应保留来源时间，并在重要行动前重新确认有效性。",
        "独立风险分析：试点若只接收简单案件，会夸大表现；若忽略人工复核和失败补救成本，会低估成本。分层报告和完整成本归集比单一平均值更有解释力。"
      ],
      "independent_judgment": "我的判断是，先证明“可安全恢复且不会重复执行”，再证明“结果有所改善”。建议从单一低风险交接点开始，使用故障注入测试断网、超时、重复事件与权限变化；通过后再延长运行周期。扩展门槛应同时包含业务效果和安全指标，不能只凭任务完成率。即使自动化在技术上成功，若客户负担或复核成本上升，也应保留回退到人工流程的选择。"
    },
    "vocabulary": [
      {
        "term": "outage",
        "phonetic": "/ˈaʊ.t̬ɪdʒ/",
        "part_of_speech": "noun",
        "meaning_zh": "服务中断",
        "example_en": "An outage triggered the support workflow.",
        "example_zh": "一次服务中断触发了客服流程。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/outage"
      },
      {
        "term": "mortgage",
        "phonetic": "/ˈmɔːr.ɡɪdʒ/",
        "part_of_speech": "noun",
        "meaning_zh": "住房抵押贷款",
        "example_en": "The mortgage application needs a final review.",
        "example_zh": "这份住房抵押贷款申请需要最终审核。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/mortgage"
      },
      {
        "term": "revenue",
        "phonetic": "/ˈrev.ə.nuː/",
        "part_of_speech": "noun",
        "meaning_zh": "业务收入",
        "example_en": "Higher revenue does not always mean higher profit.",
        "example_zh": "收入增加并不总意味着利润增加。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/revenue"
      },
      {
        "term": "intake",
        "phonetic": "/ˈɪn.teɪk/",
        "part_of_speech": "noun",
        "meaning_zh": "客户初步接洽",
        "example_en": "The intake form records the initial request.",
        "example_zh": "初步接洽表记录最初的请求。",
        "pronunciation_source": "https://dictionary.cambridge.org/dictionary/english/intake"
      },
      {
        "term": "evidence",
        "phonetic": "/ˈev.ə.dəns/",
        "part_of_speech": "noun",
        "meaning_zh": "案件证据",
        "example_en": "Every decision should link to its evidence.",
        "example_zh": "每项决定都应关联其证据。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/evidence"
      },
      {
        "term": "persistence",
        "phonetic": "/pɚˈsɪs.təns/",
        "part_of_speech": "noun",
        "meaning_zh": "持续跟进的毅力",
        "example_en": "Persistence must respect a customer’s request to stop.",
        "example_zh": "持续跟进必须尊重客户要求停止的意愿。",
        "pronunciation_source": "https://dictionary.cambridge.org/it/pronuncia/inglese/persistence"
      },
      {
        "term": "reliability",
        "phonetic": "/rɪˌlaɪ.əˈbɪl.ə.t̬i/",
        "part_of_speech": "noun",
        "meaning_zh": "执行可靠性",
        "example_en": "We test reliability after a simulated restart.",
        "example_zh": "我们在模拟重启后测试可靠性。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/reliability"
      },
      {
        "term": "procurement",
        "phonetic": "/prəˈkjʊr.mənt/",
        "part_of_speech": "noun",
        "meaning_zh": "企业采购",
        "example_en": "Procurement asked for a measurable acceptance criterion.",
        "example_zh": "采购团队要求可衡量的验收标准。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/procurement"
      },
      {
        "term": "attribution",
        "phonetic": "/ˌæt.rəˈbjuː.ʃən/",
        "part_of_speech": "noun",
        "meaning_zh": "成果贡献归因",
        "example_en": "Attribution requires a credible comparison group.",
        "example_zh": "成果归因需要可信的对照组。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/attribution"
      },
      {
        "term": "compliance",
        "phonetic": "/kəmˈplaɪ.əns/",
        "part_of_speech": "noun",
        "meaning_zh": "合规要求",
        "example_en": "Compliance checks remain necessary after automation.",
        "example_zh": "自动化后仍然需要合规检查。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/compliance"
      }
    ],
    "copyright_mode": "original_summary_only"
  },
  "upstream_title_zh": "赢得接力赛：高价值客户旅程中的长期运行智能体"
}
```
