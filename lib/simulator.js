// /lib/simulator.js
// Pure math — runs entirely in browser, no API call needed

export function simulateInvestment({
  monthlyAmount,    // ₹ invested per month
  annualReturn,     // % annual return (e.g. 12 for 12%)
  years,            // investment duration
  inflationRate = 6 // India avg inflation
}) {
  const months = years * 12;
  const monthlyRate = annualReturn / 100 / 12;
  const monthlyInflation = inflationRate / 100 / 12;

  let data = [];
  let invested = 0;
  let value = 0;

  for (let m = 1; m <= months; m++) {
    invested += monthlyAmount;
    value = (value + monthlyAmount) * (1 + monthlyRate);

    // Record yearly snapshots
    if (m % 12 === 0) {
      const year = m / 12;
      const inflationAdjusted = value / Math.pow(1 + inflationRate / 100, year);
      data.push({
        year,
        invested: Math.round(invested),
        value: Math.round(value),
        inflationAdjusted: Math.round(inflationAdjusted),
        gains: Math.round(value - invested),
      });
    }
  }

  const final = data[data.length - 1];

  return {
    data,                                           // yearly breakdown for chart
    summary: {
      totalInvested: final.invested,
      finalValue: final.value,
      totalGains: final.gains,
      inflationAdjusted: final.inflationAdjusted,
      returnMultiple: (final.value / final.invested).toFixed(2),
      xirr: annualReturn,
    },
  };
}

// 🇮🇳 Preset scenarios for Indian investment options
export const INVESTMENT_PRESETS = {
  sip: { name: "Mutual Fund SIP", annualReturn: 12, risk: "Medium" },
  fd: { name: "Fixed Deposit", annualReturn: 7, risk: "Low" },
  ppf: { name: "PPF", annualReturn: 7.1, risk: "None" },
  elss: { name: "ELSS (Tax Saving)", annualReturn: 13, risk: "Medium-High" },
  nps: { name: "NPS", annualReturn: 10, risk: "Low-Medium" },
  stocks: { name: "Direct Stocks", annualReturn: 15, risk: "High" },
};