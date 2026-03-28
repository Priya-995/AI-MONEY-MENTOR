import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are "Artha" — a friendly, sharp, and deeply knowledgeable Indian financial advisor AI.
You speak in simple English mixed with occasional Hindi phrases (like "bilkul", "sahi hai", "ek kaam karo") to feel warm and relatable to Indian users.

Your job is to:
1. Help users understand their financial health
2. Ask smart questions to extract: monthly income, expenses (rent, food, EMIs, etc.), savings, goals (house, car, retirement, travel)
3. Give practical, India-specific advice (mention SIPs, PPF, NPS, FDs, ELSS, etc.)
4. Be encouraging and non-judgmental — many users are first-time earners

CONVERSATION FLOW:
- Start by warmly greeting and asking about their financial situation
- Gradually extract: income → expenses → savings → goals → timeline
- Once you have enough data, offer to calculate their Financial Health Score
- Always explain WHY you're asking something

DATA EXTRACTION:
When the user shares financial data, ALWAYS include a JSON block at the end of your response like this:
<data>
{
  "income": 75000,
  "expenses": {
    "rent": 15000,
    "food": 8000,
    "transport": 3000,
    "emis": 10000,
    "other": 5000
  },
  "savings": 10000,
  "goals": ["buy a car in 2 years", "emergency fund"],
  "extracted": true
}
</data>

Only include the <data> block when you have real numbers from the user. If data is partial, include only what you know.

PERSONALITY RULES:
- Never be preachy or lecture-y
- Use bullet points and emojis for clarity (₹ for rupees, 📈 for growth, 💡 for tips)
- Keep responses under 200 words unless explaining something complex
- Always end with ONE clear next question or action`;

export async function POST(request) {
  console.log("🔑 Key loaded:", !!process.env.GROQ_API_KEY);

  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    // Groq uses same format as OpenAI — super simple!
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // best free model on Groq
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages, // spread full conversation history
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const rawText = response.choices[0].message.content;

    // 🔍 Parse out the <data> block if present
    let extractedData = null;
    const dataMatch = rawText.match(/<data>([\s\S]*?)<\/data>/);
    if (dataMatch) {
      try {
        extractedData = JSON.parse(dataMatch[1].trim());
      } catch (e) {
        // ignore parse errors
      }
    }

    // Clean message shown to user
    const cleanMessage = rawText.replace(/<data>[\s\S]*?<\/data>/, "").trim();

    return Response.json({
      message: cleanMessage,
      extractedData: extractedData,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to get AI response", details: error.message },
      { status: 500 }
    );
  }
}