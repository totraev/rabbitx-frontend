export type PriceLevel = {
  price: number;
  size: number;
  total: number;
}

export type Alignment = 'left' | 'right' | 'center';

export type Row = {
  price: number;
  size: number;
  total: number;
};

export type Column = {
  key: keyof Row;
  width: number;
  align: Alignment;
  digits: number;
}

export type Config = {
  pixelRatio: number;
  width: number;
  height: number;
  side: 'ask' | 'bid';
  numberOfRows: number;
  columns: Column[];
  sortOrder: 'ASC' | 'DESC';
  renderDirection: 'start-top' | 'start-bottom';
}

export type Styles = {
  font: string;
  rowHeight: number;
  color: string;
  priceColor: string;
  removalColor: string;
  bgColor: string;
}