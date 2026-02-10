import { GoogleGenerativeAI } from "@google/generative-ai";

interface MonthlyInsightsData {
  envelopeHealth: {
    onTrack: number;
    atRisk: number;
    overspent: number;
  };
  topOverspent: {
    fundName: string;
    amount: number;
    percentage: number;
  } | null;
  topLeftover: {
    fundName: string;
    amount: number;
  } | null;
  monthComparison: {
    current: number;
    previous: number;
    percentageChange: number;
    isFirstMonth: boolean;
  };
  totalSpending: number;
}

const SYSTEM_PROMPT = `You are a friendly, supportive personal finance assistant for a budgeting app. Your role is to provide brief, encouraging monthly summaries that help users feel in control of their finances.

Guidelines:
- Be warm and supportive, never judgmental
- Keep responses to 2-3 sentences max
- Focus on what's going well, then gently mention areas to watch
- Use simple, conversational language
- If things look tough, be empathetic and offer hope
- Never use phrases like "you failed" or "you overspent badly"
- Format currency as ₱X,XXX (Philippine pesos)`;

export async function generateMonthlySummary(
  data: MonthlyInsightsData,
  apiKey: string | undefined
): Promise<string | null> {
  if (!apiKey) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const { envelopeHealth, topOverspent, topLeftover, monthComparison } = data;
    const total =
      envelopeHealth.onTrack + envelopeHealth.atRisk + envelopeHealth.overspent;

    const prompt = buildPrompt({
      envelopeHealth,
      topOverspent,
      topLeftover,
      monthComparison,
      total,
      totalSpending: data.totalSpending,
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text.trim() || null;
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}

function buildPrompt({
  envelopeHealth,
  topOverspent,
  topLeftover,
  monthComparison,
  total,
  totalSpending,
}: {
  envelopeHealth: MonthlyInsightsData["envelopeHealth"];
  topOverspent: MonthlyInsightsData["topOverspent"];
  topLeftover: MonthlyInsightsData["topLeftover"];
  monthComparison: MonthlyInsightsData["monthComparison"];
  total: number;
  totalSpending: number;
}): string {
  const lines: string[] = [
    "Generate a brief monthly spending summary based on this data:",
  ];

  lines.push(`\nTotal spending this month: ₱${totalSpending.toLocaleString()}`);

  if (total > 0) {
    lines.push(
      `\nEnvelope status: ${envelopeHealth.onTrack} on track, ${envelopeHealth.atRisk} at risk, ${envelopeHealth.overspent} overspent (out of ${total} budgeted categories)`
    );
  } else {
    lines.push("\nNo budgeted categories set up yet.");
  }

  if (topOverspent) {
    lines.push(
      `\nMost over budget: ${topOverspent.fundName} (₱${Math.round(topOverspent.amount).toLocaleString()} over, ${Math.round(topOverspent.percentage)}% of budget used)`
    );
  }

  if (topLeftover) {
    lines.push(
      `\nMost remaining: ${topLeftover.fundName} (₱${Math.round(topLeftover.amount).toLocaleString()} left)`
    );
  }

  if (!monthComparison.isFirstMonth && monthComparison.previous > 0) {
    const direction = monthComparison.percentageChange > 0 ? "more" : "less";
    const absChange = Math.abs(monthComparison.percentageChange);
    lines.push(
      `\nCompared to last month: ${Math.round(absChange)}% ${direction} (₱${monthComparison.current.toLocaleString()} vs ₱${monthComparison.previous.toLocaleString()})`
    );
  } else if (monthComparison.isFirstMonth) {
    lines.push("\nThis is the user's first month using the app.");
  }

  lines.push(
    "\n\nProvide a brief, encouraging 2-3 sentence summary. Focus on the positive while gently acknowledging any challenges."
  );

  return lines.join("");
}
