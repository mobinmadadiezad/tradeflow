import type { Trade } from "@/types/trade";

export function calculateTradeStats(trades: Trade[]) {
  const totalTrades = trades.length;

  const winningTrades = trades.filter((trade) => trade.status === "WIN").length;

  const losingTrades = trades.filter((trade) => trade.status === "LOSS").length;

  const breakevenTrades = trades.filter(
    (trade) => trade.status === "BREAKEVEN",
  ).length;

  const netProfitLoss = trades.reduce(
    (total, trade) => total + trade.profitLoss,
    0,
  );

  const averageProfitLoss = totalTrades > 0 ? netProfitLoss / totalTrades : 0;

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  const riskRewardValues = trades
    .map((trade) => calculateRiskReward(trade))
    .filter((value): value is number => value !== null);

  const averageRiskReward =
    riskRewardValues.length > 0
      ? riskRewardValues.reduce((total, value) => total + value, 0) /
        riskRewardValues.length
      : 0;

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    breakevenTrades,
    netProfitLoss,
    averageProfitLoss,
    winRate,
    averageRiskReward,
  };
}

export function calculateDailyPerformance(trades: Trade[]) {
  const dailyResults = trades.reduce<Record<string, number>>(
    (result, trade) => {
      const date = trade.closeDate;

      result[date] = (result[date] ?? 0) + trade.profitLoss;

      return result;
    },
    {},
  );

  return Object.entries(dailyResults)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, profitLoss]) => ({
      date,
      profitLoss,
    }));
}

export function calculateRiskReward(trade: Trade): number | null {
  const risk = Math.abs(trade.entryPrice - trade.stopLoss);
  const reward = Math.abs(trade.takeProfit - trade.entryPrice);

  if (risk === 0) return null;

  return reward / risk;
}

export function calculateBestAndWorstDay(trades: Trade[]) {
  const dailyPerformance = calculateDailyPerformance(trades);

  if (dailyPerformance.length === 0) {
    return {
      bestDay: null,
      worstDay: null,
    };
  }

  const bestDay = dailyPerformance.reduce((best, current) =>
    current.profitLoss > best.profitLoss ? current : best,
  );

  const worstDay = dailyPerformance.reduce((worst, current) =>
    current.profitLoss < worst.profitLoss ? current : worst,
  );

  return {
    bestDay,
    worstDay,
  };
}
