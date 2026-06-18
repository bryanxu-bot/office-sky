import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是一位深圳写字楼市场资深分析师，拥有超过15年的商业地产研究经验。你精通深圳各商圈写字楼市场动态。请基于你的专业知识，对用户提供的写字楼项目进行全面诊断分析。

## 深圳写字楼市场基准数据（2026年6月）

**全市概况：**
- 甲级写字楼总存量：1,080万㎡
- 全市平均空置率：24.8%
- 全市平均租金：178元/㎡/月，同比下降6.2%
- 租金连续30个月下行，市场处于租户优势期

**各商圈基准：**
| 商圈 | 存量 | 空置率 | 平均租金 |
|------|------|--------|----------|
| 福田中心区 | 380万㎡ | 22.5% | 210元/㎡/月 |
| 南山后海 | 260万㎡ | 25.1% | 185元/㎡/月 |
| 前海 | 195万㎡ | 32.4% | 148元/㎡/月 |
| 罗湖 | 145万㎡ | 20.8% | 155元/㎡/月 |
| 宝安中心区 | 100万㎡ | 28.6% | 132元/㎡/月 |

**客群结构：** 科技/互联网 32.5% | 金融/保险 24.8% | 专业服务 14.2% | 房地产 8.6% | 贸易 7.3% | 生物医药 5.8% | 新能源 4.5%

**超甲级写字楼租金区间：** 220-320元/㎡/月（如平安金融中心、华润大厦、京基100、城脉中心）
**甲级写字楼租金区间：** 120-220元/㎡/月

**市场趋势：** ① 科技企业连续三年占比上升 ② 小面积（<500㎡）需求增长 ③ 前海高空置率（32.4%）承压 ④ 2025-2026年新增供应放缓（20-40万㎡/年）

## 输出要求

请为该项目生成完整的诊断报告。严格按以下JSON格式输出，不要有任何多余文字：

{
  "diagnosis": {
    "summary": "一段话总结项目整体定位、核心竞争力与市场表现，200-300字",
    "strengths": [
      {"point": "核心优势1"},
      {"point": "核心优势2"},
      {"point": "核心优势3"},
      {"point": "核心优势4"}
    ],
    "weaknesses": [
      {"point": "主要劣势1"},
      {"point": "主要劣势2"},
      {"point": "主要劣势3"},
      {"point": "主要劣势4"}
    ],
    "opportunities": [
      {"point": "市场机遇1"},
      {"point": "市场机遇2"},
      {"point": "市场机遇3"},
      {"point": "市场机遇4"}
    ],
    "threats": [
      {"point": "潜在威胁1"},
      {"point": "潜在威胁2"},
      {"point": "潜在威胁3"},
      {"point": "潜在威胁4"}
    ],
    "scorecard": {
      "location": 8.5,
      "quality": 7.5,
      "leasing": 6.5,
      "investment": 7.0,
      "outlook": 7.0
    }
  },
  "peerComparison": [
    {"project": "竞品项目名", "rent": 200, "vacancy": 20.0}
  ]
}

## 评分标准

- **location（区位价值）**：商圈成熟度、交通便利性、周边配套 → 前海6-7、罗湖7-8、福田8-9.5、南山后海7.5-9
- **quality（硬件品质）**：建筑规格、绿色认证、电梯/空调/层高 → 超甲级8-10、甲级6-8、老旧甲级5-7
- **leasing（租赁表现）**：出租率、租金水平、租户稳定性 → 高空置率4-6、中等6-8、低空置率8-9.5
- **investment（投资价值）**：资本增值潜力、租金回报、流动性 → 结合商圈前景和资产稀缺性
- **outlook（发展前景）**：未来12-24个月的市场预期 → 考虑新增供应压力、产业结构、政策利好

## 重要规则

1. 评分必须客观，不要所有项目都给8-9分。根据项目实际情况拉开差距
2. 每条SWOT必须具体，不要泛泛而谈。"交通便利"太泛 → "紧邻1号线购物公园站，步行3分钟"
3. summary必须包含具体数据（租金水平、空置率、建成年份、建筑高度等）
4. peerComparison列出3-4个同商圈的真实可比项目，租金和空置率要符合该商圈基准
5. 如果项目信息较少，请基于商圈特征和你对该项目的知识进行合理推断`;

export async function POST(request: NextRequest) {
  if (!DEEPSEEK_KEY) {
    return NextResponse.json(
      { error: "DeepSeek API key not configured" },
      { status: 500 }
    );
  }

  let body: {
    name: string;
    address: string;
    district?: string;
    businessArea?: string;
    location?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, address, district, businessArea, location } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Building name is required" },
      { status: 400 }
    );
  }

  // Build user message with all available context
  const locationInfo = location
    ? `坐标：${location}（经度,纬度）`
    : "";
  const userMessage = `请为以下深圳写字楼项目进行诊断分析：

项目名称：${name}
地址：${address || "未提供"}
所在区域：${district || "未提供"}
商圈：${businessArea || "未提供"}
${locationInfo}

请基于你的专业知识和对该项目的了解，生成完整的诊断报告JSON。`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4096,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error("DeepSeek API error:", res.status, errText);
      return NextResponse.json(
        { error: `DeepSeek API returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "DeepSeek returned empty response" },
        { status: 502 }
      );
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // Try to extract JSON from markdown code block
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[1]);
        } catch {
          return NextResponse.json(
            { error: "Failed to parse diagnosis JSON", raw: content.slice(0, 500) },
            { status: 502 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Failed to parse diagnosis JSON", raw: content.slice(0, 500) },
          { status: 502 }
        );
      }
    }

    // Validate the structure
    const d = result.diagnosis;
    if (
      !d ||
      !d.summary ||
      !Array.isArray(d.strengths) ||
      !Array.isArray(d.weaknesses) ||
      !Array.isArray(d.opportunities) ||
      !Array.isArray(d.threats) ||
      !d.scorecard
    ) {
      return NextResponse.json(
        {
          error: "Diagnosis response missing required fields",
          received: Object.keys(result),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Diagnosis generation timed out (30s)" },
        { status: 504 }
      );
    }
    console.error("DeepSeek request error:", err);
    return NextResponse.json(
      { error: "Diagnosis generation failed" },
      { status: 502 }
    );
  }
}
