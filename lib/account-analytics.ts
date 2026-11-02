import type { Trade } from "@/types/trade";

export function calculateNetProfitLoss(trade: Trade): number {
  return (
    trade.profitLoss -
    trade.commission -
    trade.swap
  );
}

export function calculateCurrentBalance(
  initialBalance: number,
  trades: Trade[],
): number {
  const totalNetProfitLoss = trades.reduce(
    (total, trade) => total + calculateNetProfitLoss(trade),
    0,
  );

  return initialBalance + totalNetProfitLoss;
}