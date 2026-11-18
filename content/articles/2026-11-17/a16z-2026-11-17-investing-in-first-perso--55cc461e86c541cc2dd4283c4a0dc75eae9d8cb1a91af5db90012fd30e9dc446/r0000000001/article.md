# Investing in First Person Labs

投资 First Person Labs：个人上下文的控制权

Joel de la Garza, Martin Casado · 2026-11-17

Article ID: a16z-2026-11-17-investing-in-first-person-labs · Revision: 1

Source: a16z.com

Original URL: https://a16z.com/announcement/investing-in-first-person-labs/

Selected: 2026-11-18

Copyright mode: original\_summary\_only

Rights: summary\_only

Original source © 2026 Andreessen Horowitz. Original bilingual summaries and independent commentary only.

No permission to reproduce the full source is claimed. No source full text or private learning data is included.

Topics: AI, Personal agents, Privacy

Selection / summary: 从个人智能体的上下文归属理解产品权限与可迁移性；选取尚未归档的官方新文章。

## Bilingual reading

### s01 (paragraph, order 0)

a16z backs First Person Labs, whose product Second aims to supply personal context across agents. The announcement frames user control as a design requirement, not merely a convenience.

a16z 投资 First Person Labs，其产品 Second 旨在跨智能体提供个人上下文。公告把用户控制权视为设计要求，而不只是便利功能。

### s02 (paragraph, order 1)

The described design uses a device-local background engine and a portable personal model. These are investor-reported product claims; this reading does not independently verify their implementation.

公告描述了默认在设备运行的后台引擎及可迁移的个人模型。这些属于投资方陈述，本次阅读未独立验证实现情况。

## Analysis

原文主张：个人智能体所用上下文应由用户控制。
- 公告以 Second 的本地运行、可检查及可迁移设计说明投资逻辑，未提供产品评测数据。

### discussion

- 独立解读：可以把个人上下文产品拆成采集、解释、授权、使用、纠错五层。采集到一句话不等于获得长期使用许可；推断出的偏好也不应与用户明确指令拥有相同权重。界面需要让人看清数据来源、推断依据、适用范围和失效条件。
- 独立解读：导出按钮本身不证明可迁移性。可提出一个验收实验：把同一份脱敏测试资料交给两种客户端，比较权限、来源和删除标记是否完整保留。只有文本能搬走、授权语义却丢失，仍会造成新的迁移成本。
- 独立判断：个人记忆产品的优先级应是可纠错，而不是尽可能多地记住。先用虚构数据验证“错误偏好被更正后，下游助手能否停止沿用旧判断”。同时区分停止共享、删除源记录、删除派生记录三种操作，明确哪些对象已处理、哪些仍待处理。与堆叠记忆数量相比，这种可复盘的纠错链路更适合作为早期产品验收标准。

### limitations

这是一则投资公告而非独立安全审计；不能由产品理念推断隐私保证或市场表现。

独立分析的边界：本地运行并不自动消除端点失窃、恶意插件或用户误授权风险。这里提出的是设计检查问题，不是已发现该产品存在具体漏洞。

### independent judgment

独立判断：个人记忆产品的优先级应是可纠错，而不是尽可能多地记住。先用虚构数据验证“错误偏好被更正后，下游助手能否停止沿用旧判断”。同时区分停止共享、删除源记录、删除派生记录三种操作，明确哪些对象已处理、哪些仍待处理。与堆叠记忆数量相比，这种可复盘的纠错链路更适合作为早期产品验收标准。

## Vocabulary

### personal

/ˈpɝː.sən.əl/ · adjective

个人的

ID: up-01285c024416c361d7655d66 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Keep personal notes separate from shared project files.

把个人笔记与共享项目文件分开。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/personal
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### context

/ˈkɑːn.tekst/ · noun

个人背景信息

ID: up-7089b78b62faa1c8d1984996 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The assistant needs context to interpret this request.

助手需要背景信息来理解这项请求。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/context
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### sensitive

/ˈsen.sə.t̬ɪv/ · adjective

涉及隐私的

ID: up-5d2ebd27dbd2c71357987aed · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Review sensitive records before granting access.

授权访问前先检查敏感记录。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/sensitive
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### model

/ˈmɑː.dəl/ · noun

个人信息模型

ID: up-5df93001642df4ceaf07ff4b · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): An outdated model can produce the wrong suggestion.

过时的模型可能给出错误建议。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/model
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### influence

/ˈɪn.flu.əns/ · noun

影响力

ID: up-e317abe043c26589a6647aae · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): A saved preference can have influence on later choices.

保存的偏好可能影响之后的选择。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/influence
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### accumulate

/əˈkjuː.mjə.leɪt/ · verb

积累

ID: up-f2dcb0414c291e6032e6bdf0 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Small errors can accumulate over time.

小错误会随时间积累。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/accumulate
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### architecture

/ˈɑːr.kə.tek.tʃɚ/ · noun

系统架构

ID: up-87131aef667708f516011685 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The architecture separates storage from permission checks.

这个架构将存储与权限检查分开。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/architecture
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### portable

/ˈpɔːr.t̬ə.bəl/ · adjective

可迁移的

ID: up-1077aeb36b578c84f0a6df32 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): A portable archive should preserve its source labels.

可迁移档案应保留来源标签。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/portable
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### intelligence

/ɪnˈtel.ə.dʒəns/ · noun

智能能力

ID: up-5dd5d46ea55d7f658a896992 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): More intelligence does not replace clear authorization.

更强的智能不能取代明确授权。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/intelligence
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

### privacy

/ˈpraɪ.və.si/ · noun

隐私

ID: up-75ad7950fe6ddc3bcdad31c3 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The team reviews privacy before adding a new integration.

团队在增加新集成前审查隐私问题。

Vocabulary extensions:
- pronunciation\_source: https://dictionary.cambridge.org/pronunciation/english/privacy
- pronunciation\_variant: US
- example\_origin: original\_teaching\_example

## Complete provenance and extensions

```json
{
  "upstream_snapshot": {
    "schema_version": "1.0.0",
    "id": "a16z-2026-11-17-investing-in-first-person-labs",
    "source": {
      "publisher": "Andreessen Horowitz",
      "domain": "a16z.com",
      "content_type": "official_investment_announcement"
    },
    "title": "Investing in First Person Labs",
    "author": [
      "Joel de la Garza",
      "Martin Casado"
    ],
    "published_at": "2026-11-17",
    "selected_at": "2026-11-18",
    "url": "https://a16z.com/announcement/investing-in-first-person-labs/",
    "topics": [
      "AI",
      "Personal agents",
      "Privacy"
    ],
    "selection_reason": "从个人智能体的上下文归属理解产品权限与可迁移性；选取尚未归档的官方新文章。",
    "segments": [
      {
        "id": "s01",
        "en": "a16z backs First Person Labs, whose product Second aims to supply personal context across agents. The announcement frames user control as a design requirement, not merely a convenience.",
        "zh": "a16z 投资 First Person Labs，其产品 Second 旨在跨智能体提供个人上下文。公告把用户控制权视为设计要求，而不只是便利功能。"
      },
      {
        "id": "s02",
        "en": "The described design uses a device-local background engine and a portable personal model. These are investor-reported product claims; this reading does not independently verify their implementation.",
        "zh": "公告描述了默认在设备运行的后台引擎及可迁移的个人模型。这些属于投资方陈述，本次阅读未独立验证实现情况。"
      }
    ],
    "analysis": {
      "core_thesis": "原文主张：个人智能体所用上下文应由用户控制。",
      "supporting_evidence": [
        "公告以 Second 的本地运行、可检查及可迁移设计说明投资逻辑，未提供产品评测数据。"
      ],
      "industry_significance": [
        "独立解读：可以把个人上下文产品拆成采集、解释、授权、使用、纠错五层。采集到一句话不等于获得长期使用许可；推断出的偏好也不应与用户明确指令拥有相同权重。界面需要让人看清数据来源、推断依据、适用范围和失效条件。",
        "独立解读：导出按钮本身不证明可迁移性。可提出一个验收实验：把同一份脱敏测试资料交给两种客户端，比较权限、来源和删除标记是否完整保留。只有文本能搬走、授权语义却丢失，仍会造成新的迁移成本。"
      ],
      "limitations": [
        "这是一则投资公告而非独立安全审计；不能由产品理念推断隐私保证或市场表现。",
        "独立分析的边界：本地运行并不自动消除端点失窃、恶意插件或用户误授权风险。这里提出的是设计检查问题，不是已发现该产品存在具体漏洞。"
      ],
      "independent_judgment": "独立判断：个人记忆产品的优先级应是可纠错，而不是尽可能多地记住。先用虚构数据验证“错误偏好被更正后，下游助手能否停止沿用旧判断”。同时区分停止共享、删除源记录、删除派生记录三种操作，明确哪些对象已处理、哪些仍待处理。与堆叠记忆数量相比，这种可复盘的纠错链路更适合作为早期产品验收标准。"
    },
    "vocabulary": [
      {
        "term": "personal",
        "phonetic": "/ˈpɝː.sən.əl/",
        "part_of_speech": "adjective",
        "meaning_zh": "个人的",
        "example_en": "Keep personal notes separate from shared project files.",
        "example_zh": "把个人笔记与共享项目文件分开。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/personal",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "context",
        "phonetic": "/ˈkɑːn.tekst/",
        "part_of_speech": "noun",
        "meaning_zh": "个人背景信息",
        "example_en": "The assistant needs context to interpret this request.",
        "example_zh": "助手需要背景信息来理解这项请求。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/context",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "sensitive",
        "phonetic": "/ˈsen.sə.t̬ɪv/",
        "part_of_speech": "adjective",
        "meaning_zh": "涉及隐私的",
        "example_en": "Review sensitive records before granting access.",
        "example_zh": "授权访问前先检查敏感记录。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/sensitive",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "model",
        "phonetic": "/ˈmɑː.dəl/",
        "part_of_speech": "noun",
        "meaning_zh": "个人信息模型",
        "example_en": "An outdated model can produce the wrong suggestion.",
        "example_zh": "过时的模型可能给出错误建议。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/model",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "influence",
        "phonetic": "/ˈɪn.flu.əns/",
        "part_of_speech": "noun",
        "meaning_zh": "影响力",
        "example_en": "A saved preference can have influence on later choices.",
        "example_zh": "保存的偏好可能影响之后的选择。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/influence",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "accumulate",
        "phonetic": "/əˈkjuː.mjə.leɪt/",
        "part_of_speech": "verb",
        "meaning_zh": "积累",
        "example_en": "Small errors can accumulate over time.",
        "example_zh": "小错误会随时间积累。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/accumulate",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "architecture",
        "phonetic": "/ˈɑːr.kə.tek.tʃɚ/",
        "part_of_speech": "noun",
        "meaning_zh": "系统架构",
        "example_en": "The architecture separates storage from permission checks.",
        "example_zh": "这个架构将存储与权限检查分开。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/architecture",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "portable",
        "phonetic": "/ˈpɔːr.t̬ə.bəl/",
        "part_of_speech": "adjective",
        "meaning_zh": "可迁移的",
        "example_en": "A portable archive should preserve its source labels.",
        "example_zh": "可迁移档案应保留来源标签。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/portable",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "intelligence",
        "phonetic": "/ɪnˈtel.ə.dʒəns/",
        "part_of_speech": "noun",
        "meaning_zh": "智能能力",
        "example_en": "More intelligence does not replace clear authorization.",
        "example_zh": "更强的智能不能取代明确授权。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/intelligence",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      },
      {
        "term": "privacy",
        "phonetic": "/ˈpraɪ.və.si/",
        "part_of_speech": "noun",
        "meaning_zh": "隐私",
        "example_en": "The team reviews privacy before adding a new integration.",
        "example_zh": "团队在增加新集成前审查隐私问题。",
        "extensions": {
          "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/privacy",
          "pronunciation_variant": "US",
          "example_origin": "original_teaching_example"
        }
      }
    ],
    "copyright_mode": "original_summary_only",
    "meta": {
      "notes": [
        "未取得当天精选对话原始 JSON。本条由已核实的 a16z 官方网页独立编写；摘要不是全文翻译。",
        "深度解读中标为独立判断的内容是编辑建议，非原文结论。词汇例句均为原创教学例句。"
      ]
    }
  },
  "upstream_title_zh": "投资 First Person Labs：个人上下文的控制权"
}
```
