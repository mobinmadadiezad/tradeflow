export type TradeDirection = "BUY" | "SELL";

export type TradeStatus = "WIN" | "LOSS" | "BREAKEVEN";

// وضعیت رعایت پلن معاملاتی
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

  profitLoss: number;
  status: TradeStatus;

  openDate: string;
  closeDate: string;

  notes: string;

  // وضعیت انطباق معامله با پلن
  planCompliance?: PlanCompliance;
};
