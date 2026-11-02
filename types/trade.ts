export type TradeDirection = "BUY" | "SELL";

export type TradeStatus = "WIN" | "LOSS" | "BREAKEVEN";

export type PlanCompliance = "FOLLOWED" | "NOT_FOLLOWED" | "NOT_CHECKED";

export type Trade = {
  id: string;
  symbol: string;
  direction: TradeDirection;

  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  volume: number;

  // سود و زیان خام، قبل از کسر هزینه‌ها
  profitLoss: number;

  // هزینه‌های معامله
  commission: number;
  swap: number;

  status: TradeStatus;

  openDate: string;
  closeDate: string;

  notes: string;
  planCompliance?: PlanCompliance;
};
