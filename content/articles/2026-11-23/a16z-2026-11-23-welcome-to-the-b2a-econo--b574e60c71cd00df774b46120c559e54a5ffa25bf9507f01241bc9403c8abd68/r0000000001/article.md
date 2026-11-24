# Welcome to the B2A Economy: How Agents Buy

走进 B2A 经济：智能体如何购物

Olivia Moore, Justine Moore · 2026-11-23

Article ID: a16z-2026-11-23-welcome-to-the-b2a-economy-how-agents-buy · Revision: 1

Source: Andreessen Horowitz

Original URL: https://a16z.com/welcome-to-the-b2a-economy-how-agents-buy/

Selected: 2026-11-24

Copyright mode: original\_summary\_only

Rights: summary\_only

Source article by Olivia Moore and Justine Moore, published by Andreessen Horowitz. Bilingual summaries, analysis and vocabulary examples are original writing.

No original article full text, graphics or charts are reproduced. The daily-selection JSON was unavailable; this version was independently written against the verified official article.

Topics: Commerce, AI Agents, Product Discovery

Selection / summary: 官方后续研究区分购物智能体的推荐、信息核验与消费记录，且与目录和商品可发现性有关。未取得当天精选原始 JSON。

## Bilingual reading

### s1 (paragraph, order 0)

The authors compare how shopping agents narrow down a wide range of products. They combine a controlled comparison of recommendation runs with a separate look at observed spending. The two sources answer different questions: which options an agent proposes and where transactions are recorded.

作者对比购物智能体如何从大量商品中筛选候选项。研究同时观察多轮推荐实验和另一个来源的实际消费记录。两类数据回答的问题不同：一类说明智能体推荐了什么，另一类说明交易记录出现在哪里。

### s2 (paragraph, order 1)

In broad queries, agents often converged on familiar options, but a more specific need could change the result. A merchant therefore has a reason to publish verifiable details about the tasks and buyers the product is designed for.

宽泛请求下，多个智能体经常推荐类似的常见选项；补充具体需求，就可能改变结果。因此，商家有理由公开可核验的细节，说明产品分别适合什么任务和买家。

### s3 (paragraph, order 2)

The ability to check a product independently matters as much as the claims on the page. Price, stock, return terms and product capabilities become useful when agents can find them and compare like with like. The article also distinguishes apparent bargains from offers with credible warranty and seller information.

产品卖点之外，信息能否被独立核实也很重要。只有智能体能找到价格、库存、退货条款和功能，并在同一口径下比较，它们才有实际作用。文章也区分了看起来便宜的报价和具备可信保修及商家信息的报价。

### s4 (paragraph, order 3)

Different agents consult different sources and present recommendations differently. Marketplace visibility can help discovery, but it does not eliminate the need for a direct product page with consistent facts.

不同智能体查阅的信息来源不同，呈现推荐的方式也不同。平台上的曝光有助于被发现，但直达商品页仍应给出一致的事实。

## Analysis

把智能体购物看成一条从发现、核验到交易的链路，而不是另一个搜索排名。 / Treat agent commerce as discovery, verification and purchase rather than a new ranking alone.
- 文中报告对四种智能体做了 1270 个请求、11307 次完成运行的实验；宽泛问题上推荐重叠不代表有代表性的市场份额。 / The reported experiment compared 11,307 completed runs; overlapping picks are not a measure of market share.
- 相同起价并不代表等值：文中的配对比较显示退货条件和商家可信度可能改变结果。 / Paired comparisons suggest that returns and seller credibility can change a recommendation.

### discussion

- 商品团队可从一个已知场景开始，把规格、变体、实际到手价和售后条款放在可核验的位置。 / Start with one use case and make its variant details, full price and terms verifiable.
- 分开衡量是否进入候选、是否正确核对商品和是否到达可购买页面。 / Measure discovery, product-fact accuracy and access to checkout separately.
- 让商品目录与落地页引用同一套商品事实。否则，分发越广，智能体越容易遇到彼此矛盾的库存和价格。 / Keep catalogs and landing pages aligned; more distribution can expose more conflicting prices and availability if the underlying facts diverge.
- 先抽查一个真实商品和两种购买意图，在不同助手上记录是否找到同一变体，以及是否正确读取库存、总价和退货条件。用同一组提示词建立基线，再改一个因素。若商品根本没有进入候选，先修目录；若进了候选但结论错误，先核对商品页和交付条款。 / Test one SKU against two purchase intents, then change one factor against that baseline. If the product never makes the shortlist, examine catalog coverage; if it makes the list but the recommendation gets the facts wrong, audit the product page and fulfillment terms.

### limitations

实验由文章作者与一家相关商业服务商合作；模型版本、提示词和平台数据范围都可能影响结果。 / The findings depend on the tested prompts, products, platforms and versions.

观察到的消费只是该数据来源可见的行为，不能代替整体市场或说明改动导致了增长。 / Observed spending reflects the available sample, not a causal estimate or a total market.

### independent judgment

先抽查一个真实商品和两种购买意图，在不同助手上记录是否找到同一变体，以及是否正确读取库存、总价和退货条件。用同一组提示词建立基线，再改一个因素。若商品根本没有进入候选，先修目录；若进了候选但结论错误，先核对商品页和交付条款。 / Test one SKU against two purchase intents, then change one factor against that baseline. If the product never makes the shortlist, examine catalog coverage; if it makes the list but the recommendation gets the facts wrong, audit the product page and fulfillment terms.

## Vocabulary

### influence

/ˈɪn.flu.əns/ · verb

影响购买选择

ID: up-88a4106fbc9b3828a2183ac5 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): Delivery promises can influence the final purchase.

配送承诺可能影响最终购买选择。

### distribution

/ˌdɪs.trɪˈbjuː.ʃən/ · noun

商品分发

ID: up-e91c111ade930d6bb7ac8f87 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The small brand tested a second distribution channel.

这个小品牌测试了第二条商品分发渠道。

### merchant

/ˈmɝː.tʃənt/ · noun

商家

ID: up-efb81892267a1655050af212 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The merchant keeps its return policy visible on product pages.

商家在商品页明显位置展示退货政策。

### shortlist

/ˈʃɔːrt.lɪst/ · noun

候选清单

ID: up-0cbead0f38356d269c4d05fd · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): A clear size guide helped the product make the shortlist.

清晰的尺码指南帮助商品进入候选清单。

### catalog

/ˈkæt̬.əl.ɑːɡ/ · noun

商品目录

ID: up-8743e8a1c2019fc42fc90245 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The catalog groups different sizes under one product.

目录将不同尺码归在同一商品下。

### metadata

/ˈmet̬.əˌdeɪ.t̬ə/ · noun

商品元数据

ID: up-34431ee40d45ea2f31e27904 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The metadata states whether a variant is available.

元数据标明商品变体是否有货。

### superiority

/səˌpɪr.iˈɔːr.ə.t̬i/ · noun

特定场景下的优势

ID: up-b88e14c827f2c2399d46a0c1 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The test showed the lighter model’s superiority for daily travel.

测试显示较轻的型号在日常出行时更有优势。

### persona

/pɚˈsoʊ.nə/ · noun

用户画像

ID: up-1b06b89154e6ca840777698b · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): This persona represents occasional rather than professional buyers.

这个用户画像代表偶尔购买的人而不是专业买家。

### crawler

/ˈkrɑː.lɚ/ · noun

网页爬虫

ID: up-b5eeacd138c11b137b5ae0c3 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The crawler can read the published product description.

网页爬虫可以读取公开发布的商品描述。

### verification

/ˌver.ə.fəˈkeɪ.ʃən/ · noun

信息核验

ID: up-0d657c545266dc237c9073a3 · Article-level vocabulary; no inferred segment association

Supplied example (not a source quotation): The price needed verification before the recommendation was sent.

发出推荐前需要核验价格。

## Complete provenance and extensions

```json
{
  "upstream_snapshot": {
    "schema_version": "1.0.0",
    "id": "a16z-2026-11-23-welcome-to-the-b2a-economy-how-agents-buy",
    "source": {
      "name": "Andreessen Horowitz",
      "domain": "a16z.com",
      "language": "en"
    },
    "title": "Welcome to the B2A Economy: How Agents Buy",
    "author": [
      "Olivia Moore",
      "Justine Moore"
    ],
    "published_at": "2026-11-23",
    "selected_at": "2026-11-24",
    "url": "https://a16z.com/welcome-to-the-b2a-economy-how-agents-buy/",
    "topics": [
      "Commerce",
      "AI Agents",
      "Product Discovery"
    ],
    "selection_reason": "官方后续研究区分购物智能体的推荐、信息核验与消费记录，且与目录和商品可发现性有关。未取得当天精选原始 JSON。",
    "segments": [
      {
        "id": "s1",
        "en": "The authors compare how shopping agents narrow down a wide range of products. They combine a controlled comparison of recommendation runs with a separate look at observed spending. The two sources answer different questions: which options an agent proposes and where transactions are recorded.",
        "zh": "作者对比购物智能体如何从大量商品中筛选候选项。研究同时观察多轮推荐实验和另一个来源的实际消费记录。两类数据回答的问题不同：一类说明智能体推荐了什么，另一类说明交易记录出现在哪里。"
      },
      {
        "id": "s2",
        "en": "In broad queries, agents often converged on familiar options, but a more specific need could change the result. A merchant therefore has a reason to publish verifiable details about the tasks and buyers the product is designed for.",
        "zh": "宽泛请求下，多个智能体经常推荐类似的常见选项；补充具体需求，就可能改变结果。因此，商家有理由公开可核验的细节，说明产品分别适合什么任务和买家。"
      },
      {
        "id": "s3",
        "en": "The ability to check a product independently matters as much as the claims on the page. Price, stock, return terms and product capabilities become useful when agents can find them and compare like with like. The article also distinguishes apparent bargains from offers with credible warranty and seller information.",
        "zh": "产品卖点之外，信息能否被独立核实也很重要。只有智能体能找到价格、库存、退货条款和功能，并在同一口径下比较，它们才有实际作用。文章也区分了看起来便宜的报价和具备可信保修及商家信息的报价。"
      },
      {
        "id": "s4",
        "en": "Different agents consult different sources and present recommendations differently. Marketplace visibility can help discovery, but it does not eliminate the need for a direct product page with consistent facts.",
        "zh": "不同智能体查阅的信息来源不同，呈现推荐的方式也不同。平台上的曝光有助于被发现，但直达商品页仍应给出一致的事实。"
      }
    ],
    "analysis": {
      "core_thesis": "把智能体购物看成一条从发现、核验到交易的链路，而不是另一个搜索排名。 / Treat agent commerce as discovery, verification and purchase rather than a new ranking alone.",
      "supporting_evidence": [
        "文中报告对四种智能体做了 1270 个请求、11307 次完成运行的实验；宽泛问题上推荐重叠不代表有代表性的市场份额。 / The reported experiment compared 11,307 completed runs; overlapping picks are not a measure of market share.",
        "相同起价并不代表等值：文中的配对比较显示退货条件和商家可信度可能改变结果。 / Paired comparisons suggest that returns and seller credibility can change a recommendation."
      ],
      "industry_significance": [
        "商品团队可从一个已知场景开始，把规格、变体、实际到手价和售后条款放在可核验的位置。 / Start with one use case and make its variant details, full price and terms verifiable.",
        "分开衡量是否进入候选、是否正确核对商品和是否到达可购买页面。 / Measure discovery, product-fact accuracy and access to checkout separately.",
        "让商品目录与落地页引用同一套商品事实。否则，分发越广，智能体越容易遇到彼此矛盾的库存和价格。 / Keep catalogs and landing pages aligned; more distribution can expose more conflicting prices and availability if the underlying facts diverge."
      ],
      "limitations": [
        "实验由文章作者与一家相关商业服务商合作；模型版本、提示词和平台数据范围都可能影响结果。 / The findings depend on the tested prompts, products, platforms and versions.",
        "观察到的消费只是该数据来源可见的行为，不能代替整体市场或说明改动导致了增长。 / Observed spending reflects the available sample, not a causal estimate or a total market."
      ],
      "independent_judgment": "先抽查一个真实商品和两种购买意图，在不同助手上记录是否找到同一变体，以及是否正确读取库存、总价和退货条件。用同一组提示词建立基线，再改一个因素。若商品根本没有进入候选，先修目录；若进了候选但结论错误，先核对商品页和交付条款。 / Test one SKU against two purchase intents, then change one factor against that baseline. If the product never makes the shortlist, examine catalog coverage; if it makes the list but the recommendation gets the facts wrong, audit the product page and fulfillment terms."
    },
    "vocabulary": [
      {
        "term": "influence",
        "phonetic": "/ˈɪn.flu.əns/",
        "part_of_speech": "verb",
        "meaning_zh": "影响购买选择",
        "example_en": "Delivery promises can influence the final purchase.",
        "example_zh": "配送承诺可能影响最终购买选择。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/influence"
      },
      {
        "term": "distribution",
        "phonetic": "/ˌdɪs.trɪˈbjuː.ʃən/",
        "part_of_speech": "noun",
        "meaning_zh": "商品分发",
        "example_en": "The small brand tested a second distribution channel.",
        "example_zh": "这个小品牌测试了第二条商品分发渠道。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/distribution"
      },
      {
        "term": "merchant",
        "phonetic": "/ˈmɝː.tʃənt/",
        "part_of_speech": "noun",
        "meaning_zh": "商家",
        "example_en": "The merchant keeps its return policy visible on product pages.",
        "example_zh": "商家在商品页明显位置展示退货政策。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/merchant"
      },
      {
        "term": "shortlist",
        "phonetic": "/ˈʃɔːrt.lɪst/",
        "part_of_speech": "noun",
        "meaning_zh": "候选清单",
        "example_en": "A clear size guide helped the product make the shortlist.",
        "example_zh": "清晰的尺码指南帮助商品进入候选清单。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/shortlist"
      },
      {
        "term": "catalog",
        "phonetic": "/ˈkæt̬.əl.ɑːɡ/",
        "part_of_speech": "noun",
        "meaning_zh": "商品目录",
        "example_en": "The catalog groups different sizes under one product.",
        "example_zh": "目录将不同尺码归在同一商品下。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/catalog"
      },
      {
        "term": "metadata",
        "phonetic": "/ˈmet̬.əˌdeɪ.t̬ə/",
        "part_of_speech": "noun",
        "meaning_zh": "商品元数据",
        "example_en": "The metadata states whether a variant is available.",
        "example_zh": "元数据标明商品变体是否有货。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/metadata"
      },
      {
        "term": "superiority",
        "phonetic": "/səˌpɪr.iˈɔːr.ə.t̬i/",
        "part_of_speech": "noun",
        "meaning_zh": "特定场景下的优势",
        "example_en": "The test showed the lighter model’s superiority for daily travel.",
        "example_zh": "测试显示较轻的型号在日常出行时更有优势。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/superiority"
      },
      {
        "term": "persona",
        "phonetic": "/pɚˈsoʊ.nə/",
        "part_of_speech": "noun",
        "meaning_zh": "用户画像",
        "example_en": "This persona represents occasional rather than professional buyers.",
        "example_zh": "这个用户画像代表偶尔购买的人而不是专业买家。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/persona"
      },
      {
        "term": "crawler",
        "phonetic": "/ˈkrɑː.lɚ/",
        "part_of_speech": "noun",
        "meaning_zh": "网页爬虫",
        "example_en": "The crawler can read the published product description.",
        "example_zh": "网页爬虫可以读取公开发布的商品描述。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/crawler"
      },
      {
        "term": "verification",
        "phonetic": "/ˌver.ə.fəˈkeɪ.ʃən/",
        "part_of_speech": "noun",
        "meaning_zh": "信息核验",
        "example_en": "The price needed verification before the recommendation was sent.",
        "example_zh": "发出推荐前需要核验价格。",
        "pronunciation_source": "https://dictionary.cambridge.org/us/pronunciation/english/verification"
      }
    ],
    "copyright_mode": "original_summary_only"
  },
  "upstream_title_zh": "走进 B2A 经济：智能体如何购物"
}
```
