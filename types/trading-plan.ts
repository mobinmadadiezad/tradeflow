export type TradingRule = {
  id: string;
  text: string;
};

export type TradingPlan = {
  symbol: string;
  analysisTimeframe: string;
  confirmationTimeframe: string;

  riskPerTrade: number;
  maxDailyTrades: number;
  minRiskReward: number;

  tradingSession: string;

  entryRules: TradingRule[];
  buyConditions: TradingRule[];
  sellConditions: TradingRule[];
  noTradeRules: TradingRule[];

  newsRules: TradingRule[];
};
