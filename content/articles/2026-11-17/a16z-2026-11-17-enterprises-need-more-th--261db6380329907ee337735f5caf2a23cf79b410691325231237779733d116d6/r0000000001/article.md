# Enterprises need more than payments to put agents to work

企业要让 AI 智能体真正干活，光有支付还不够

Christian Crowley · 2026-11-17

Article ID: a16z-2026-11-17-enterprises-need-more-than-payments-to-put-agents-to-work · Revision: 1

Source: a16z Frontier

Original URL: https://a16zfrontier.com/posts/article/enterprises-need-more-than-payments/

Selected: 2026-11-28

Copyright mode: original\_summary\_only

Rights: summary\_only

Original source by Christian Crowley, published by a16z Frontier. This archive contains independently written bilingual summaries, analysis and practice examples.

No source prose is reproduced. No full-text reproduction license is claimed.

Topics: AI Agents, Enterprise Software, Delegated Authority

Selection / summary: 当天精选无可用附件，独立选读官方文章。它从企业愿意交给智能体的具体任务切入，区分能力、授权和支付三类障碍。

## Bilingual reading

### s01 (paragraph, order 0)

Crowley expected payment rails to dominate his conversations with AI companies. Instead, infrastructure operators were busy bringing capacity online and protecting margins, while teams giving agents real work were more concerned with reliability and the boundaries of access.

克劳利原以为支付会是与 AI 公司讨论最多的话题。实际交流中，基础设施服务商忙着增加可用算力并守住利润率；让智能体负责实际工作的团队则更关心可靠性与权限边界。

### s02 (paragraph, order 1)

An incident assistant illustrates the gap: collecting evidence and drafting a proposal are not the same as changing a live system. When the customer grants permission, a vendor runs the assistant, and another service receives requests, the receiving service still has to enforce the limit.

故障处理智能体揭示了这一差别：查看证据、起草建议，不等于修改生产系统。客户授权、供应商运行智能体、第三方服务接收请求时，权限边界仍要由接收方执行。

### s03 (paragraph, order 2)

The author sees a potential role for shared permission records and verifiable signatures when organizations cannot depend on one party’s records. He does not treat a ledger as a substitute for existing identity systems or for decisions about who may grant and withdraw access.

作者认为，多个机构无法只依赖一方记录时，共享的权限记录和可验证签名有用武之地。但账本不能代替现有身份系统，也不能替组织决定谁有权授权和撤权。

### s04 (paragraph, order 3)

The proposed sales test is one workflow a customer cannot safely hand off today. Payment improvements become relevant when the workflow actually runs into purchase or settlement friction, not simply because an agent is involved.

作者建议从客户今天无法安全委托的单项流程切入。只有当流程真的受采购或结算阻碍时，改善支付才有价值；仅有智能体参与，并不足以证明需要新支付方式。

## Analysis

企业采购的不是智能体的无限自主性，而是能在清晰责任边界内交出去的一项工作。支付决定智能体能否买单；可靠性、授权和接收系统的执行决定它能否被委托。
- 文章援引 Okta 对 150 位 IT 和安全决策者的调查：69% 报告安全顾虑拖慢采用，27% 同意现有身份系统完全具备规模化管控能力。这是样本中的主观报告，两项指标并不互补。
- 作者用供应商运营的故障助手说明权责分离，并用链上会话签名案例说明用户无需逐笔批准的委托可以存在。后者并不证明同一机制在企业系统中直接有效。

### discussion

- 试点应分开看输出质量和权限执行：前者用任务正确率和返工率衡量，后者用撤权生效时间、审计记录完整度以及异常请求是否被拒绝衡量。两组指标都过关，才能扩大委托。
- 企业内部采用者与对外出售智能体的平台面对不同成本：前者需要减少审批与追责成本，后者需要减少为每个客户定制授权的工时。用同一套功能介绍，未必能向两类买家证明价值。
- 我会先用客户现有身份系统和审计工具试做一项受限委托，分别验证允许的操作成功、未批准的操作被拒绝、撤权后下一次请求失效，再比较人工审批次数和处理时间。只有参与方无法接受单一记录方、目标系统又能可靠核对并执行权限时，才值得试验共享账本。

### limitations

交流样本来自作者所在的业务团队，不能据此确定企业总体需求排序；文章没有对普通权限系统与链上登记做成本、可靠性或撤权时效的量化比较。

记录可验证不代表动作已在目标系统得到正确执行，也不验证智能体的结果质量。跨组织治理仍要明确责任与补救流程。

### independent judgment

我会先用客户现有身份系统和审计工具试做一项受限委托，分别验证允许的操作成功、未批准的操作被拒绝、撤权后下一次请求失效，再比较人工审批次数和处理时间。只有参与方无法接受单一记录方、目标系统又能可靠核对并执行权限时，才值得试验共享账本。

## Vocabulary

### infrastructure

/ˈɪn.frəˌstrʌk.tʃɚ/ · n.

支撑智能体运行的基础设施

ID: up-ab3d162a90946f6dc3953f35 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Reliable infrastructure keeps scheduled jobs running through traffic spikes.

可靠的基础设施能让定时任务在流量激增时继续运行。

### inference

/ˈɪn.fɚ.əns/ · n.

运行模型得出结果的推理

ID: up-654aa19294187ccef5ad9537 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The team measured the cost of inference for a batch of requests.

团队测量了一批请求的模型推理成本。

### capacity

/kəˈpæs.ə.t̬i/ · n.

可调度的计算产能

ID: up-1bed9e636649e67f6405b8e2 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The provider reserved enough capacity for the evening peak.

服务商为晚间高峰预留了足够算力。

### deployment

/dɪˈplɔɪ.mənt/ · n.

把系统投入实际使用的部署

ID: up-03b82310af1076430d8302e7 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The first deployment was limited to one test environment.

首次部署仅限一个测试环境。

### margin

/ˈmɑːr.dʒɪn/ · n.

收入扣去成本后的利润率

ID: up-f4c45d05efa89aa3d16a0437 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Idle hardware can put pressure on the provider’s margin.

闲置硬件可能压低服务商的利润率。

### reliability

/rɪˌlaɪ.əˈbɪl.ə.t̬i/ · n.

稳定完成任务的可靠性

ID: up-dda84603340eba6693bcfe90 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The trial measured reliability separately from response time.

试点将可靠性与响应时间分开衡量。

### authorize

/ˈɑː.θɚ.aɪz/ · v.

批准执行具体操作

ID: up-417aaf5bf4bc700c1c820e15 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Only the workspace owner can authorize the export.

只有工作区所有者可以批准导出。

### delegate

/ˈdel.ə.ɡeɪt/ · v.

把限定任务委托给他者

ID: up-c748665a19ef1591cb3d2ec8 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The editor can delegate the routine check without delegating publication.

编辑可以委托例行检查，但不交出发布权限。

### revoke

/rɪˈvoʊk/ · v.

收回先前授予的权限

ID: up-e9438174f9cb7059e236088a · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): An administrator can revoke access when the trial ends.

试点结束后，管理员可以撤销访问权。

### adoption

/əˈdɑːp.ʃən/ · n.

组织采纳并使用一项工具

ID: up-859426572d5d8ff871827a3b · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The team tracked adoption through completed tasks rather than sign-ups.

团队按完成的任务而不是注册人数来衡量采纳情况。

### leakage

/ˈliː.kɪdʒ/ · n.

信息流向未获授权处的泄露

ID: up-7f89178666de8702694f9f3d · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The review checked for data leakage between separate workspaces.

审查检查了隔离的工作区之间是否存在数据泄露。

### autonomy

/ɑːˈtɑː.nə.mi/ · n.

无需人工逐步介入的自主性

ID: up-171b34071480c60893685f4a · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The system gained autonomy only after it passed the approval tests.

系统通过审批测试后才获得更大的自主性。

## Complete provenance and extensions

```json
{
  "upstream_snapshot": {
    "schema_version": "1.0.0",
    "id": "a16z-2026-11-17-enterprises-need-more-than-payments-to-put-agents-to-work",
    "source": {
      "name": "a16z Frontier",
      "domain": "a16zfrontier.com",
      "language": "en"
    },
    "title": "Enterprises need more than payments to put agents to work",
    "author": [
      "Christian Crowley"
    ],
    "published_at": "2026-11-17",
    "selected_at": "2026-11-28",
    "url": "https://a16zfrontier.com/posts/article/enterprises-need-more-than-payments/",
    "topics": [
      "AI Agents",
      "Enterprise Software",
      "Delegated Authority"
    ],
    "selection_reason": "当天精选无可用附件，独立选读官方文章。它从企业愿意交给智能体的具体任务切入，区分能力、授权和支付三类障碍。",
    "segments": [
      {
        "id": "s01",
        "en": "Crowley expected payment rails to dominate his conversations with AI companies. Instead, infrastructure operators were busy bringing capacity online and protecting margins, while teams giving agents real work were more concerned with reliability and the boundaries of access.",
        "zh": "克劳利原以为支付会是与 AI 公司讨论最多的话题。实际交流中，基础设施服务商忙着增加可用算力并守住利润率；让智能体负责实际工作的团队则更关心可靠性与权限边界。"
      },
      {
        "id": "s02",
        "en": "An incident assistant illustrates the gap: collecting evidence and drafting a proposal are not the same as changing a live system. When the customer grants permission, a vendor runs the assistant, and another service receives requests, the receiving service still has to enforce the limit.",
        "zh": "故障处理智能体揭示了这一差别：查看证据、起草建议，不等于修改生产系统。客户授权、供应商运行智能体、第三方服务接收请求时，权限边界仍要由接收方执行。"
      },
      {
        "id": "s03",
        "en": "The author sees a potential role for shared permission records and verifiable signatures when organizations cannot depend on one party’s records. He does not treat a ledger as a substitute for existing identity systems or for decisions about who may grant and withdraw access.",
        "zh": "作者认为，多个机构无法只依赖一方记录时，共享的权限记录和可验证签名有用武之地。但账本不能代替现有身份系统，也不能替组织决定谁有权授权和撤权。"
      },
      {
        "id": "s04",
        "en": "The proposed sales test is one workflow a customer cannot safely hand off today. Payment improvements become relevant when the workflow actually runs into purchase or settlement friction, not simply because an agent is involved.",
        "zh": "作者建议从客户今天无法安全委托的单项流程切入。只有当流程真的受采购或结算阻碍时，改善支付才有价值；仅有智能体参与，并不足以证明需要新支付方式。"
      }
    ],
    "analysis": {
      "core_thesis": "企业采购的不是智能体的无限自主性，而是能在清晰责任边界内交出去的一项工作。支付决定智能体能否买单；可靠性、授权和接收系统的执行决定它能否被委托。",
      "supporting_evidence": [
        "文章援引 Okta 对 150 位 IT 和安全决策者的调查：69% 报告安全顾虑拖慢采用，27% 同意现有身份系统完全具备规模化管控能力。这是样本中的主观报告，两项指标并不互补。",
        "作者用供应商运营的故障助手说明权责分离，并用链上会话签名案例说明用户无需逐笔批准的委托可以存在。后者并不证明同一机制在企业系统中直接有效。"
      ],
      "industry_significance": [
        "试点应分开看输出质量和权限执行：前者用任务正确率和返工率衡量，后者用撤权生效时间、审计记录完整度以及异常请求是否被拒绝衡量。两组指标都过关，才能扩大委托。",
        "企业内部采用者与对外出售智能体的平台面对不同成本：前者需要减少审批与追责成本，后者需要减少为每个客户定制授权的工时。用同一套功能介绍，未必能向两类买家证明价值。"
      ],
      "limitations": [
        "交流样本来自作者所在的业务团队，不能据此确定企业总体需求排序；文章没有对普通权限系统与链上登记做成本、可靠性或撤权时效的量化比较。",
        "记录可验证不代表动作已在目标系统得到正确执行，也不验证智能体的结果质量。跨组织治理仍要明确责任与补救流程。"
      ],
      "independent_judgment": "我会先用客户现有身份系统和审计工具试做一项受限委托，分别验证允许的操作成功、未批准的操作被拒绝、撤权后下一次请求失效，再比较人工审批次数和处理时间。只有参与方无法接受单一记录方、目标系统又能可靠核对并执行权限时，才值得试验共享账本。"
    },
    "vocabulary": [
      {
        "term": "infrastructure",
        "phonetic": "/ˈɪn.frəˌstrʌk.tʃɚ/",
        "part_of_speech": "n.",
        "meaning_zh": "支撑智能体运行的基础设施",
        "example_en": "Reliable infrastructure keeps scheduled jobs running through traffic spikes.",
        "example_zh": "可靠的基础设施能让定时任务在流量激增时继续运行。"
      },
      {
        "term": "inference",
        "phonetic": "/ˈɪn.fɚ.əns/",
        "part_of_speech": "n.",
        "meaning_zh": "运行模型得出结果的推理",
        "example_en": "The team measured the cost of inference for a batch of requests.",
        "example_zh": "团队测量了一批请求的模型推理成本。"
      },
      {
        "term": "capacity",
        "phonetic": "/kəˈpæs.ə.t̬i/",
        "part_of_speech": "n.",
        "meaning_zh": "可调度的计算产能",
        "example_en": "The provider reserved enough capacity for the evening peak.",
        "example_zh": "服务商为晚间高峰预留了足够算力。"
      },
      {
        "term": "deployment",
        "phonetic": "/dɪˈplɔɪ.mənt/",
        "part_of_speech": "n.",
        "meaning_zh": "把系统投入实际使用的部署",
        "example_en": "The first deployment was limited to one test environment.",
        "example_zh": "首次部署仅限一个测试环境。"
      },
      {
        "term": "margin",
        "phonetic": "/ˈmɑːr.dʒɪn/",
        "part_of_speech": "n.",
        "meaning_zh": "收入扣去成本后的利润率",
        "example_en": "Idle hardware can put pressure on the provider’s margin.",
        "example_zh": "闲置硬件可能压低服务商的利润率。"
      },
      {
        "term": "reliability",
        "phonetic": "/rɪˌlaɪ.əˈbɪl.ə.t̬i/",
        "part_of_speech": "n.",
        "meaning_zh": "稳定完成任务的可靠性",
        "example_en": "The trial measured reliability separately from response time.",
        "example_zh": "试点将可靠性与响应时间分开衡量。"
      },
      {
        "term": "authorize",
        "phonetic": "/ˈɑː.θɚ.aɪz/",
        "part_of_speech": "v.",
        "meaning_zh": "批准执行具体操作",
        "example_en": "Only the workspace owner can authorize the export.",
        "example_zh": "只有工作区所有者可以批准导出。"
      },
      {
        "term": "delegate",
        "phonetic": "/ˈdel.ə.ɡeɪt/",
        "part_of_speech": "v.",
        "meaning_zh": "把限定任务委托给他者",
        "example_en": "The editor can delegate the routine check without delegating publication.",
        "example_zh": "编辑可以委托例行检查，但不交出发布权限。"
      },
      {
        "term": "revoke",
        "phonetic": "/rɪˈvoʊk/",
        "part_of_speech": "v.",
        "meaning_zh": "收回先前授予的权限",
        "example_en": "An administrator can revoke access when the trial ends.",
        "example_zh": "试点结束后，管理员可以撤销访问权。"
      },
      {
        "term": "adoption",
        "phonetic": "/əˈdɑːp.ʃən/",
        "part_of_speech": "n.",
        "meaning_zh": "组织采纳并使用一项工具",
        "example_en": "The team tracked adoption through completed tasks rather than sign-ups.",
        "example_zh": "团队按完成的任务而不是注册人数来衡量采纳情况。"
      },
      {
        "term": "leakage",
        "phonetic": "/ˈliː.kɪdʒ/",
        "part_of_speech": "n.",
        "meaning_zh": "信息流向未获授权处的泄露",
        "example_en": "The review checked for data leakage between separate workspaces.",
        "example_zh": "审查检查了隔离的工作区之间是否存在数据泄露。"
      },
      {
        "term": "autonomy",
        "phonetic": "/ɑːˈtɑː.nə.mi/",
        "part_of_speech": "n.",
        "meaning_zh": "无需人工逐步介入的自主性",
        "example_en": "The system gained autonomy only after it passed the approval tests.",
        "example_zh": "系统通过审批测试后才获得更大的自主性。"
      }
    ],
    "copyright_mode": "original_summary_only"
  },
  "upstream_title_zh": "企业要让 AI 智能体真正干活，光有支付还不够"
}
```
