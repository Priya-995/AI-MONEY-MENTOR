// /app/api/plan/route.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { financialData, score } = body;

    if (!financialData || !financialData.income) {
      return Response.json(
        { error: "financialData is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert Indian financial planner. Based on this user's financial data, create a practical 90-day financial plan.

FINANCIAL DATA:
- Monthly Income: ₹${financialData.income}
- Monthly Expenses: ${JSON.stringify(financialData.expenses)}
- Current Savings: ₹${financialData.savings}
- Goals: ${JSON.stringify(financialData.goals)}
- Financial Health Score: ${score?.totalScore || "N/A"}/100

Generate a 90-day plan as a JSON object. Be specific with Indian financial products (SIP, PPF, FD, ELSS, NPS, etc.) and real rupee amounts.

RESPOND ONLY WITH THIS JSON (no extra text):
{
  "summary": "2-3 line summary of their situation and plan focus",
  "months": [
    {
      "month": 1,
      "title": "Month title (e.g. Foundation Building)",
      "focus": "Main focus area",
      "weeks": [
        {
          "week": 1,
          "action": "Specific action to take",
          "amount": 5000,
          "category": "savings|investment|expense|emergency"
        },
        {
          "week": 2,
          "action": "Specific action to take",
          "amount": 2000,
          "category": "savings|investment|expense|emergency"
        },
        {
          "week": 3,
          "action": "Specific action to take",
          "amount": 3000,
          "category": "savings|investment|expense|emergency"
        },
        {
          "week": 4,
          "action": "Specific action to take",
          "amount": 1000,
          "category": "savings|investment|expense|emergency"
        }
      ],
      "milestone": "What they should achieve by end of this month"
    },
    {
      "month": 2,
      "title": "Month 2 title",
      "focus": "Main focus area",
      "weeks": [...4 weeks...],
      "milestone": "Month 2 milestone"
    },
    {
      "month": 3,
      "title": "Month 3 title",
      "focus": "Main focus area",
      "weeks": [...4 weeks...],
      "milestone": "Month 3 milestone"
    }
  ],
  "recommendations": [
    "Specific recommendation 1 with rupee amounts",
    "Specific recommendation 2 with product names",
    "Specific recommendation 3"
  ],
  "projectedSavings": 15000
}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const rawText = response.choices[0].message.content;

    // Parse JSON — strip markdown fences if present
    let plan;
    try {
      const clean = rawText.replace(/```json|```/g, "").trim();
      plan = JSON.parse(clean);
    } catch (e) {
      return Response.json(
        { error: "Failed to parse plan JSON", raw: rawText },
        { status: 500 }
      );
    }

    return Response.json({ success: true, plan });

  } catch (error) {
    console.error("Plan API error:", error);
    return Response.json(
      { error: "Failed to generate plan", details: error.message },
      { status: 500 }
    );
  }
}