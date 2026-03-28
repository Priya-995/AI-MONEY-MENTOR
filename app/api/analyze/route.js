// /app/api/analyze/route.js

// 📊 Scoring weights (total = 100)
// Savings Rate     → 30 points
// Expense Ratio    → 30 points  
// Emergency Fund   → 25 points
// Goal Alignment   → 15 points

function calculateScore(data) {
  const { income, expenses, savings, goals } = data;

  const totalExpenses = Object.values(expenses || {}).reduce((a, b) => a + b, 0);
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const expenseRatio = income > 0 ? (totalExpenses / income) * 100 : 100;

  // 💰 Savings Rate Score (30 pts)
  // Ideal: save 20%+ of income
  let savingsScore = 0;
  if (savingsRate >= 30) savingsScore = 30;
  else if (savingsRate >= 20) savingsScore = 25;
  else if (savingsRate >= 10) savingsScore = 15;
  else if (savingsRate >= 5) savingsScore = 8;
  else savingsScore = 2;

  // 📊 Expense Ratio Score (30 pts)
  // Ideal: spend less than 60% of income
  let expenseScore = 0;
  if (expenseRatio <= 50) expenseScore = 30;
  else if (expenseRatio <= 60) expenseScore = 25;
  else if (expenseRatio <= 70) expenseScore = 18;
  else if (expenseRatio <= 80) expenseScore = 10;
  else if (expenseRatio <= 90) expenseScore = 5;
  else expenseScore = 0;

  // 🛡️ Emergency Fund Score (25 pts)
  // Ideal: 6 months of expenses saved
  const monthlyExpenses = totalExpenses;
  const emergencyMonths = monthlyExpenses > 0 ? savings / monthlyExpenses : 0;
  let emergencyScore = 0;
  if (emergencyMonths >= 6) emergencyScore = 25;
  else if (emergencyMonths >= 3) emergencyScore = 18;
  else if (emergencyMonths >= 1) emergencyScore = 10;
  else emergencyScore = 3;

  // 🎯 Goal Alignment Score (15 pts)
  let goalScore = 0;
  if (goals && goals.length >= 3) goalScore = 15;
  else if (goals && goals.length === 2) goalScore = 10;
  else if (goals && goals.length === 1) goalScore = 5;
  else goalScore = 0;

  const totalScore = savingsScore + expenseScore + emergencyScore + goalScore;

  // 🏷️ Grade
  let grade, label, color;
  if (totalScore >= 80) { grade = "A"; label = "Excellent"; color = "#22c55e"; }
  else if (totalScore >= 60) { grade = "B"; label = "Good"; color = "#84cc16"; }
  else if (totalScore >= 40) { grade = "C"; label = "Fair"; color = "#f59e0b"; }
  else if (totalScore >= 20) { grade = "D"; label = "Needs Work"; color = "#f97316"; }
  else { grade = "F"; label = "Critical"; color = "#ef4444"; }

  return {
    totalScore,
    grade,
    label,
    color,
    breakdown: {
      savingsRate: {
        score: savingsScore,
        maxScore: 30,
        value: `${savingsRate.toFixed(1)}%`,
        label: "Savings Rate",
        tip: savingsRate < 20
          ? "Try to save at least 20% of your income. Start a SIP with even ₹500/month!"
          : "Great savings rate! Consider investing surplus in ELSS or index funds.",
      },
      expenseRatio: {
        score: expenseScore,
        maxScore: 30,
        value: `${expenseRatio.toFixed(1)}%`,
        label: "Expense Ratio",
        tip: expenseRatio > 70
          ? "Your expenses are high. Track and cut discretionary spending."
          : "Good expense control! Keep monitoring monthly.",
      },
      emergencyFund: {
        score: emergencyScore,
        maxScore: 25,
        value: `${emergencyMonths.toFixed(1)} months`,
        label: "Emergency Fund",
        tip: emergencyMonths < 6
          ? `Build up to 6 months of expenses (₹${(monthlyExpenses * 6).toLocaleString("en-IN")}). Keep it in a liquid FD.`
          : "Excellent! Your emergency fund is solid.",
      },
      goalAlignment: {
        score: goalScore,
        maxScore: 15,
        value: `${goals?.length || 0} goals`,
        label: "Goal Clarity",
        tip: !goals || goals.length === 0
          ? "Define clear financial goals — short term (6 months), medium (2 years), long term (5+ years)."
          : "Good! Make sure each goal has a timeline and target amount.",
      },
    },
    insights: {
      monthlySurplus: income - totalExpenses - savings,
      totalExpenses,
      savingsRate: savingsRate.toFixed(1),
      expenseRatio: expenseRatio.toFixed(1),
    },
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { financialData } = body;

    if (!financialData || !financialData.income) {
      return Response.json(
        { error: "financialData with income is required" },
        { status: 400 }
      );
    }

    const result = calculateScore(financialData);

    return Response.json({
      success: true,
      score: result,
    });

  } catch (error) {
    console.error("Analyze API error:", error);
    return Response.json(
      { error: "Failed to analyze", details: error.message },
      { status: 500 }
    );
  }
}