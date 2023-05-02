export type OrderBookData = {
  asks: [price: string, size: string][];
  bids: [price: string, size: string][];
  market_id: `orderbook:${string}`;
  sequence: number;
  timestamp: number;
};

export interface IPriceLevel {
  price: number;
  size: number;
  total: number;
}