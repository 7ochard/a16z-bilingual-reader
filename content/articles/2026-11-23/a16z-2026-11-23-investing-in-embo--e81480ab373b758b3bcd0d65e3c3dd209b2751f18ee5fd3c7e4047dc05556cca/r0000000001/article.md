# Investing in Embo

投资 Embo

Justine Moore, Raghu Raghuram, Matt Bornstein · 2026-11-23

Article ID: a16z-2026-11-23-investing-in-embo · Revision: 1

Source: Andreessen Horowitz

Original URL: https://a16z.com/announcement/investing-in-embo/

Selected: 2026-11-25

Copyright mode: original\_summary\_only

Rights: summary\_only

Original source: Andreessen Horowitz, Justine Moore, Raghu Raghuram, and Matt Bornstein.

Independently written English and Chinese summaries, analysis, and vocabulary examples. No source passages are reproduced and no permission to redistribute the full article is claimed.

Topics: Robotics, World Models, Reinforcement Learning

Selection / summary: a16z 官方投资公告以机器人跨场景迁移与失败恢复为核心，适合比较模型预测、技能训练和实机验收。未取得 11 月 25 日上游精选原始 JSON。

## Bilingual reading

### s1 (paragraph, order 0)

Embo is betting that robotics needs more than polished task demonstrations. The proposed system would learn to predict how a scene responds to an action, then use those predictions to rehearse new behavior. Two goals are distinct: handling a scene never seen during training and recovering when a step has already gone wrong.

Embo 的判断是，机器人不能只会复现演示。它试图先学会预测一个动作会怎样改变环境，再用预测结果练习新行为。这里有两个不同目标：能在训练中没见过的场景工作，以及出错后还能把任务接着做完。

### s2 (paragraph, order 1)

The article proposes combining broad video data with recordings of robot actions. A learned model can then generate practice situations without tying up a physical robot for every attempt. The authors point to Dreamer 4 making progress in Minecraft as evidence for the training idea, not as a demonstration of commercial robot performance.

文章提出把覆盖面广的视频与机器人操作记录结合起来。模型可以生成练习场景，不必把每一次尝试都放到实体机器人上。作者用 Dreamer 4 在 Minecraft 的进展说明这种训练思路可以工作，但这不是商用机器人的实机成绩。

### s3 (paragraph, order 2)

The investment thesis is that more training compute could buy more practice, including rare failures that cost time to reproduce in a lab. The practical question is how much of that practice transfers to a robot facing real sensors, contact forces and objects it has not seen before.

这笔投资看中的是：增加算力或许能换来更多练习，连实验室里难以反复制造的失败也能覆盖。真正需要实测的是，这些练习有多少能迁移到带着真实传感器、接触力和陌生物体的机器人上。

## Analysis

世界模型的价值不只是生成逼真的画面，而是降低获取行动经验的成本；能否在真实任务里提升泛化和纠错，才是投资论点的关键。
- 文章把跨环境成功与受扰后恢复分开描述，指出单次成功演示并不能回答这两个问题。
- 作者援引 Dreamer 4 在 Minecraft 中基于既有数据学习获取钻石的结果；这支持在模型内练习的思路，未直接检验机器人。
- 团队提出以视频扩大物理现象覆盖面，并以机器人示教和真实环境强化学习补充与动作相关的信息。这是公开披露的路线，不是已证实的性能。

### discussion

- 若练习成本从实机占用部分转移到算力，团队可把有限的机器人时段留给高价值的校准和压力测试。
- 对部署方而言，失误后能自行恢复可能比演示成功率更有用，因为它直接减少停机和人工接管。
- 对数据团队而言，素材的覆盖范围与动作结果的可验证性要分开预算，不能只用视频时长衡量训练价值。
- 我会用两组实机测试判断这条路线：一组在整间未见过的环境测完成率；一组人为引入同样的轻度扰动测恢复率和人工接管次数。让两套方案使用同等实机训练时长，并另外记算力成本。如果只在正常条件下表现更好，或只能在模拟里恢复，就还不能把结果算成商业上的韧性优势。

### limitations

这是投资方公告，未提供足够的公开实机基准、失败分布或与其他机器人训练方法的等预算比较。

普通视频往往没有可执行控制量或力反馈；画面可信不代表模型在特定动作下预测正确。长序列中小误差还可能累积。

Minecraft 里的状态和反馈与实体世界不同，不能用其结果推断真实机器人的安全性、故障率或部署能力。

### independent judgment

我会用两组实机测试判断这条路线：一组在整间未见过的环境测完成率；一组人为引入同样的轻度扰动测恢复率和人工接管次数。让两套方案使用同等实机训练时长，并另外记算力成本。如果只在正常条件下表现更好，或只能在模拟里恢复，就还不能把结果算成商业上的韧性优势。

## Vocabulary

### fragile

/ˈfrædʒ.əl/ · adjective

容易因环境变化失效

ID: up-0df94333ce3cc9ee7127f4ba · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): A fragile controller fails when the camera angle changes.

脆弱的控制器在摄像头角度变化时会失效。

### unfamiliar

/ʌn.fəˈmɪl.i.jɚ/ · adjective

训练中未见过的

ID: up-aae6ec222fef9c94989f9c9a · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): We tested the same grasp in an unfamiliar room.

我们在一个此前未见过的房间测试了相同的抓取动作。

### conviction

/kənˈvɪk.ʃən/ · noun

坚定的技术判断

ID: up-8d7791e58ac4836016969278 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The team’s conviction led it to prioritize prediction over imitation.

团队坚定的技术判断让它把预测放在模仿之前。

### anticipate

/ænˈtɪs.ə.peɪt/ · verb

预判动作后果

ID: up-543cdc83653d0fe98217f961 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): A robot should anticipate whether the bin will tip.

机器人应能预判收纳箱会不会倾倒。

### adapt

/əˈdæpt/ · verb

适应新环境

ID: up-fdb81120dd80b12a5d7b006e · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The policy must adapt when the handle moves.

把手位置改变时，控制策略必须适应。

### pursuit

/pɚˈsuːt/ · noun

长期研究方向

ID: up-3fd512f66a004fb850ec2d17 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Reliable manipulation remains a long-term research pursuit.

可靠的物体操作仍是一个长期研究方向。

### doctoral

/ˈdɑːk.tɚ.əl/ · adjective

博士阶段的

ID: up-a1993600bc98aaff21a7172a · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Her doctoral work focused on learning from video.

她的博士研究聚焦于从视频学习。

### generalization

/ˌdʒen.ər.əl.əˈzeɪ.ʃən/ · noun

泛化到未见场景

ID: up-d345d258b3454c567a13d0a1 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Holding out entire rooms tests generalization better than shuffling frames.

留出整间房不参加训练，比打乱视频帧更能检验泛化。

### resilience

/rɪˈzɪl.jəns/ · noun

受扰后恢复能力

ID: up-f387578a1349663cc827cf0d · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): We measured resilience by counting successful recoveries after a slip.

我们通过统计滑落后的成功恢复次数来衡量韧性。

### reinforcement

/ˌriː.ɪnˈfɔːrs.mənt/ · noun

用反馈强化行为

ID: up-899e5a5712c3e1b4fbb8541d · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): In reinforcement learning, a sparse reward may make recovery slow to learn.

在强化学习中，稀疏奖励可能使恢复动作学得很慢。

## Complete provenance and extensions

```json
{
  "upstream_snapshot": {
    "schema_version": "1.0.0",
    "id": "a16z-2026-11-23-investing-in-embo",
    "source": {
      "name": "Andreessen Horowitz",
      "domain": "a16z.com",
      "language": "en"
    },
    "title": "Investing in Embo",
    "author": [
      "Justine Moore",
      "Raghu Raghuram",
      "Matt Bornstein"
    ],
    "published_at": "2026-11-23",
    "selected_at": "2026-11-25",
    "url": "https://a16z.com/announcement/investing-in-embo/",
    "topics": [
      "Robotics",
      "World Models",
      "Reinforcement Learning"
    ],
    "selection_reason": "a16z 官方投资公告以机器人跨场景迁移与失败恢复为核心，适合比较模型预测、技能训练和实机验收。未取得 11 月 25 日上游精选原始 JSON。",
    "segments": [
      {
        "id": "s1",
        "en": "Embo is betting that robotics needs more than polished task demonstrations. The proposed system would learn to predict how a scene responds to an action, then use those predictions to rehearse new behavior. Two goals are distinct: handling a scene never seen during training and recovering when a step has already gone wrong.",
        "zh": "Embo 的判断是，机器人不能只会复现演示。它试图先学会预测一个动作会怎样改变环境，再用预测结果练习新行为。这里有两个不同目标：能在训练中没见过的场景工作，以及出错后还能把任务接着做完。"
      },
      {
        "id": "s2",
        "en": "The article proposes combining broad video data with recordings of robot actions. A learned model can then generate practice situations without tying up a physical robot for every attempt. The authors point to Dreamer 4 making progress in Minecraft as evidence for the training idea, not as a demonstration of commercial robot performance.",
        "zh": "文章提出把覆盖面广的视频与机器人操作记录结合起来。模型可以生成练习场景，不必把每一次尝试都放到实体机器人上。作者用 Dreamer 4 在 Minecraft 的进展说明这种训练思路可以工作，但这不是商用机器人的实机成绩。"
      },
      {
        "id": "s3",
        "en": "The investment thesis is that more training compute could buy more practice, including rare failures that cost time to reproduce in a lab. The practical question is how much of that practice transfers to a robot facing real sensors, contact forces and objects it has not seen before.",
        "zh": "这笔投资看中的是：增加算力或许能换来更多练习，连实验室里难以反复制造的失败也能覆盖。真正需要实测的是，这些练习有多少能迁移到带着真实传感器、接触力和陌生物体的机器人上。"
      }
    ],
    "analysis": {
      "core_thesis": "世界模型的价值不只是生成逼真的画面，而是降低获取行动经验的成本；能否在真实任务里提升泛化和纠错，才是投资论点的关键。",
      "supporting_evidence": [
        "文章把跨环境成功与受扰后恢复分开描述，指出单次成功演示并不能回答这两个问题。",
        "作者援引 Dreamer 4 在 Minecraft 中基于既有数据学习获取钻石的结果；这支持在模型内练习的思路，未直接检验机器人。",
        "团队提出以视频扩大物理现象覆盖面，并以机器人示教和真实环境强化学习补充与动作相关的信息。这是公开披露的路线，不是已证实的性能。"
      ],
      "industry_significance": [
        "若练习成本从实机占用部分转移到算力，团队可把有限的机器人时段留给高价值的校准和压力测试。",
        "对部署方而言，失误后能自行恢复可能比演示成功率更有用，因为它直接减少停机和人工接管。",
        "对数据团队而言，素材的覆盖范围与动作结果的可验证性要分开预算，不能只用视频时长衡量训练价值。"
      ],
      "limitations": [
        "这是投资方公告，未提供足够的公开实机基准、失败分布或与其他机器人训练方法的等预算比较。",
        "普通视频往往没有可执行控制量或力反馈；画面可信不代表模型在特定动作下预测正确。长序列中小误差还可能累积。",
        "Minecraft 里的状态和反馈与实体世界不同，不能用其结果推断真实机器人的安全性、故障率或部署能力。"
      ],
      "independent_judgment": "我会用两组实机测试判断这条路线：一组在整间未见过的环境测完成率；一组人为引入同样的轻度扰动测恢复率和人工接管次数。让两套方案使用同等实机训练时长，并另外记算力成本。如果只在正常条件下表现更好，或只能在模拟里恢复，就还不能把结果算成商业上的韧性优势。"
    },
    "vocabulary": [
      {
        "term": "fragile",
        "phonetic": "/ˈfrædʒ.əl/",
        "part_of_speech": "adjective",
        "meaning_zh": "容易因环境变化失效",
        "example_en": "A fragile controller fails when the camera angle changes.",
        "example_zh": "脆弱的控制器在摄像头角度变化时会失效。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/fragile"
      },
      {
        "term": "unfamiliar",
        "phonetic": "/ʌn.fəˈmɪl.i.jɚ/",
        "part_of_speech": "adjective",
        "meaning_zh": "训练中未见过的",
        "example_en": "We tested the same grasp in an unfamiliar room.",
        "example_zh": "我们在一个此前未见过的房间测试了相同的抓取动作。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/unfamiliar"
      },
      {
        "term": "conviction",
        "phonetic": "/kənˈvɪk.ʃən/",
        "part_of_speech": "noun",
        "meaning_zh": "坚定的技术判断",
        "example_en": "The team’s conviction led it to prioritize prediction over imitation.",
        "example_zh": "团队坚定的技术判断让它把预测放在模仿之前。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/conviction"
      },
      {
        "term": "anticipate",
        "phonetic": "/ænˈtɪs.ə.peɪt/",
        "part_of_speech": "verb",
        "meaning_zh": "预判动作后果",
        "example_en": "A robot should anticipate whether the bin will tip.",
        "example_zh": "机器人应能预判收纳箱会不会倾倒。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/anticipate"
      },
      {
        "term": "adapt",
        "phonetic": "/əˈdæpt/",
        "part_of_speech": "verb",
        "meaning_zh": "适应新环境",
        "example_en": "The policy must adapt when the handle moves.",
        "example_zh": "把手位置改变时，控制策略必须适应。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/adapt"
      },
      {
        "term": "pursuit",
        "phonetic": "/pɚˈsuːt/",
        "part_of_speech": "noun",
        "meaning_zh": "长期研究方向",
        "example_en": "Reliable manipulation remains a long-term research pursuit.",
        "example_zh": "可靠的物体操作仍是一个长期研究方向。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/pursuit"
      },
      {
        "term": "doctoral",
        "phonetic": "/ˈdɑːk.tɚ.əl/",
        "part_of_speech": "adjective",
        "meaning_zh": "博士阶段的",
        "example_en": "Her doctoral work focused on learning from video.",
        "example_zh": "她的博士研究聚焦于从视频学习。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/doctoral"
      },
      {
        "term": "generalization",
        "phonetic": "/ˌdʒen.ər.əl.əˈzeɪ.ʃən/",
        "part_of_speech": "noun",
        "meaning_zh": "泛化到未见场景",
        "example_en": "Holding out entire rooms tests generalization better than shuffling frames.",
        "example_zh": "留出整间房不参加训练，比打乱视频帧更能检验泛化。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/generalization"
      },
      {
        "term": "resilience",
        "phonetic": "/rɪˈzɪl.jəns/",
        "part_of_speech": "noun",
        "meaning_zh": "受扰后恢复能力",
        "example_en": "We measured resilience by counting successful recoveries after a slip.",
        "example_zh": "我们通过统计滑落后的成功恢复次数来衡量韧性。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/resilience"
      },
      {
        "term": "reinforcement",
        "phonetic": "/ˌriː.ɪnˈfɔːrs.mənt/",
        "part_of_speech": "noun",
        "meaning_zh": "用反馈强化行为",
        "example_en": "In reinforcement learning, a sparse reward may make recovery slow to learn.",
        "example_zh": "在强化学习中，稀疏奖励可能使恢复动作学得很慢。",
        "pronunciation_source": "https://dictionary.cambridge.org/pronunciation/english/reinforcement"
      }
    ],
    "copyright_mode": "original_summary_only"
  },
  "upstream_title_zh": "投资 Embo"
}
```
