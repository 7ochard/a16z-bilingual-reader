# The Dream of the 1990s Is Alive Again in Cybersecurity

网络安全重现九十年代的挑战

Zane Lackey · 2026-11-16

Article ID: a16z-2026-11-16-the-dream-of-the-1990s-is-alive-again-in-cybersecurity · Revision: 1

Source: a16z.com

Original URL: https://a16z.com/the-dream-of-the-1990s-is-alive-again-in-cybersecurity/

Selected: 2026-11-17

Copyright mode: original\_summary\_only

Rights: summary\_only

Original article © 2026 Andreessen Horowitz; author Zane Lackey.

Only independently written bilingual summaries, analysis and learning examples are archived. No full-text reproduction permission is claimed.

Topics: Cybersecurity, AI, Infrastructure

Selection / summary: 从安全响应时间差理解 AI 产品的运行风险；官方新文章，尚未归档。

## Bilingual reading

### s01 (paragraph, order 0)

Lackey compares AI-driven security pressure with earlier waves of widespread software flaws. His central concern is that attackers accelerate faster than organizations can repair systems.

Lackey 将 AI 带来的安全压力与早期大规模软件漏洞相比较，重点担忧攻击加速超过组织修复系统的速度。

### s02 (paragraph, order 1)

He advocates continuous testing, quicker response and security controls designed for agents. These are practitioner expectations, not a measured forecast of future incidents.

他主张持续测试、更快响应及面向智能体的安全控制。这些是实践者判断，并非对未来事件数量的量化预测。

## Analysis

原文主张：防御体系必须跟上 AI 加速的攻击节奏。
- 作者借历史漏洞浪潮与安全团队交流说明判断；文章未给出可复核的总体事故统计。

### discussion

- 独立解读：购买更多告警工具不等于降低损失。可以把发现、确认、授权、隔离、修复、验证拆成可计时的环节，优先改善最慢的一段。对于小团队，明确谁能紧急撤销凭据，比增加一个无人负责的仪表盘更有用。
- 独立解读：安全产品的交互设计应展示动作范围、预期影响、回滚入口与责任人，而非只展示风险分数。若自动操作会改变生产环境，需要将低风险自动化与高风险人工批准分开，避免把响应速度变成误操作速度。
- 独立判断：把安全能力验收写成可重复演练，而不是采购清单。选择一个隔离测试服务，记录一次凭据撤销从发起到生效的完整时间，检查日志是否能复盘，并验证失败后的恢复路径。先取得基线，再比较改动，才能区分工具演示与真正的运行改善。该建议不授权对任何真实系统开展攻击测试。

### limitations

原文不是受控实验，不能由历史类比推算下一次攻击的时间或损失。

独立判断的适用边界：加快修复可能增加业务中断。医疗、工业等系统应按自身可靠性约束制定发布与回滚流程，不能机械套用互联网服务节奏。

### independent judgment

独立判断：把安全能力验收写成可重复演练，而不是采购清单。选择一个隔离测试服务，记录一次凭据撤销从发起到生效的完整时间，检查日志是否能复盘，并验证失败后的恢复路径。先取得基线，再比较改动，才能区分工具演示与真正的运行改善。该建议不授权对任何真实系统开展攻击测试。

## Vocabulary

### vulnerability

/ˌvʌl.nɚ.əˈbɪl.ə.t̬i/ · noun

安全漏洞

ID: up-0a26a957208f83f9f950d173 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The audit revealed a vulnerability in our test service.

审计发现了测试服务的一处漏洞。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/vulnerability
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### offensive

/əˈfen.sɪv/ · adjective

进攻性的

ID: up-f2ff27cd8c53baf4f1007007 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Offensive testing requires explicit authorization.

进攻性测试需要明确授权。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/offensive
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### defensive

/dɪˈfen.sɪv/ · adjective

防御性的

ID: up-ded2128fc8a83833417f3ec9 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): A defensive control should have a named owner.

防御控制应有明确负责人。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/defensive
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### capacity

/kəˈpæs.ə.t̬i/ · noun

职责或身份

ID: up-78a7d95cf9338a84f0459d7b · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): She joined the exercise in an advisory capacity.

她以顾问身份参与演练。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/capacity
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### cadence

/ˈkeɪ.dəns/ · noun

反复发生的节奏

ID: up-6d7db155234bfadfd8566d0b · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Our review cadence is weekly.

我们的评审节奏是每周一次。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/cadence
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### devastating

/ˈdev.ə.steɪ.t̬ɪŋ/ · adjective

破坏性极强的

ID: up-997a1c1b9124609c8a2170f1 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): A missing backup can have devastating consequences.

缺失备份可能造成严重后果。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/devastating
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### exploit

/ɪkˈsplɔɪt/ · verb

利用漏洞

ID: up-4458ef18ba1049df26cc8bcf · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Only the authorized lab may exploit this test flaw.

只有获授权的实验室可以利用这个测试漏洞。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/exploit
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### foundational

/faʊnˈdeɪ.ʃən.əl/ · adjective

基础性的

ID: up-eb635fc1c9529fd287282a95 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Reliable logs are foundational to our review process.

可靠日志是评审流程的基础。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/foundational
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### expertise

/ˌek.spɝːˈtiːz/ · noun

专业能力

ID: up-ac529e0b87ea6ec80540aa48 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The team needs expertise in incident analysis.

团队需要事件分析方面的专业能力。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/expertise
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

### substantial

/səbˈstæn.ʃəl/ · adjective

大量的

ID: up-77d895e539c078271fd6f4ea · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Manual triage consumes substantial time.

人工分类耗费大量时间。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/substantial
- pronunciation\_variant: US
- example\_origin: original\_learning\_example

## Complete provenance and extensions

```json
{
  "upstream_snapshot": {
    "schema_version": "1.0.0",
    "id": "a16z-2026-11-16-the-dream-of-the-1990s-is-alive-again-in-cybersecurity",
    "source": {
      "publisher": "Andreessen Horowitz",
      "domain": "a16z.com",
      "content_type": "official_article"
    },
    "title": "The Dream of the 1990s Is Alive Again in Cybersecurity",
    "author": [
      "Zane Lackey"
    ],
    "published_at": "2026-11-16",
    "selected_at": "2026-11-17",
    "url": "https://a16z.com/the-dream-of-the-1990s-is-alive-again-in-cybersecurity/",
    "topics": [
      "Cybersecurity",
      "AI",
      "Infrastructure"
    ],
    "selection_reason": "从安全响应时间差理解 AI 产品的运行风险；官方新文章，尚未归档。",
    "segments": [
      {
        "id": "s01",
        "en": "Lackey compares AI-driven security pressure with earlier waves of widespread software flaws. His central concern is that attackers accelerate faster than organizations can repair systems.",
        "zh": "Lackey 将 AI 带来的安全压力与早期大规模软件漏洞相比较，重点担忧攻击加速超过组织修复系统的速度。"
      },
      {
        "id": "s02",
        "en": "He advocates continuous testing, quicker response and security controls designed for agents. These are practitioner expectations, not a measured forecast of future incidents.",
        "zh": "他主张持续测试、更快响应及面向智能体的安全控制。这些是实践者判断，并非对未来事件数量的量化预测。"
      }
    ],
    "analysis": {
      "core_thesis": "原文主张：防御体系必须跟上 AI 加速的攻击节奏。",
      "supporting_evidence": [
        "作者借历史漏洞浪潮与安全团队交流说明判断；文章未给出可复核的总体事故统计。"
      ],
      "industry_significance": [
        "独立解读：购买更多告警工具不等于降低损失。可以把发现、确认、授权、隔离、修复、验证拆成可计时的环节，优先改善最慢的一段。对于小团队，明确谁能紧急撤销凭据，比增加一个无人负责的仪表盘更有用。",
        "独立解读：安全产品的交互设计应展示动作范围、预期影响、回滚入口与责任人，而非只展示风险分数。若自动操作会改变生产环境，需要将低风险自动化与高风险人工批准分开，避免把响应速度变成误操作速度。"
      ],
      "limitations": [
        "原文不是受控实验，不能由历史类比推算下一次攻击的时间或损失。",
        "独立判断的适用边界：加快修复可能增加业务中断。医疗、工业等系统应按自身可靠性约束制定发布与回滚流程，不能机械套用互联网服务节奏。"
      ],
      "independent_judgment": "独立判断：把安全能力验收写成可重复演练，而不是采购清单。选择一个隔离测试服务，记录一次凭据撤销从发起到生效的完整时间，检查日志是否能复盘，并验证失败后的恢复路径。先取得基线，再比较改动，才能区分工具演示与真正的运行改善。该建议不授权对任何真实系统开展攻击测试。"
    },
    "vocabulary": [
      {
        "term": "vulnerability",
        "phonetic": "/ˌvʌl.nɚ.əˈbɪl.ə.t̬i/",
        "part_of_speech": "noun",
        "meaning_zh": "安全漏洞",
        "example_en": "The audit revealed a vulnerability in our test service.",
        "example_zh": "审计发现了测试服务的一处漏洞。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/vulnerability",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "offensive",
        "phonetic": "/əˈfen.sɪv/",
        "part_of_speech": "adjective",
        "meaning_zh": "进攻性的",
        "example_en": "Offensive testing requires explicit authorization.",
        "example_zh": "进攻性测试需要明确授权。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/offensive",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "defensive",
        "phonetic": "/dɪˈfen.sɪv/",
        "part_of_speech": "adjective",
        "meaning_zh": "防御性的",
        "example_en": "A defensive control should have a named owner.",
        "example_zh": "防御控制应有明确负责人。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/defensive",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "capacity",
        "phonetic": "/kəˈpæs.ə.t̬i/",
        "part_of_speech": "noun",
        "meaning_zh": "职责或身份",
        "example_en": "She joined the exercise in an advisory capacity.",
        "example_zh": "她以顾问身份参与演练。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/capacity",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "cadence",
        "phonetic": "/ˈkeɪ.dəns/",
        "part_of_speech": "noun",
        "meaning_zh": "反复发生的节奏",
        "example_en": "Our review cadence is weekly.",
        "example_zh": "我们的评审节奏是每周一次。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/cadence",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "devastating",
        "phonetic": "/ˈdev.ə.steɪ.t̬ɪŋ/",
        "part_of_speech": "adjective",
        "meaning_zh": "破坏性极强的",
        "example_en": "A missing backup can have devastating consequences.",
        "example_zh": "缺失备份可能造成严重后果。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/devastating",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "exploit",
        "phonetic": "/ɪkˈsplɔɪt/",
        "part_of_speech": "verb",
        "meaning_zh": "利用漏洞",
        "example_en": "Only the authorized lab may exploit this test flaw.",
        "example_zh": "只有获授权的实验室可以利用这个测试漏洞。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/exploit",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "foundational",
        "phonetic": "/faʊnˈdeɪ.ʃən.əl/",
        "part_of_speech": "adjective",
        "meaning_zh": "基础性的",
        "example_en": "Reliable logs are foundational to our review process.",
        "example_zh": "可靠日志是评审流程的基础。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/foundational",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "expertise",
        "phonetic": "/ˌek.spɝːˈtiːz/",
        "part_of_speech": "noun",
        "meaning_zh": "专业能力",
        "example_en": "The team needs expertise in incident analysis.",
        "example_zh": "团队需要事件分析方面的专业能力。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/expertise",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      },
      {
        "term": "substantial",
        "phonetic": "/səbˈstæn.ʃəl/",
        "part_of_speech": "adjective",
        "meaning_zh": "大量的",
        "example_en": "Manual triage consumes substantial time.",
        "example_zh": "人工分类耗费大量时间。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/substantial",
          "pronunciation_variant": "US",
          "example_origin": "original_learning_example"
        }
      }
    ],
    "copyright_mode": "original_summary_only",
    "meta": {
      "content_origin": "third_party_paraphrase",
      "source_url": "https://a16z.com/the-dream-of-the-1990s-is-alive-again-in-cybersecurity/",
      "generated_at": "2026-11-17T02:00:00Z",
      "generator": "OpenAI",
      "notes": [
        "当天未取得精选对话原始 JSON；根据已核实官方原文独立生成，不是原文件恢复。",
        "双语段落为原创摘要；深度解读明确标为独立分析；例句均为原创，不是原文引句。",
        "词汇按原文首次出现顺序排列；美式 IPA 据 Cambridge pronunciation 页面核实。"
      ]
    }
  },
  "upstream_title_zh": "网络安全重现九十年代的挑战"
}
```
