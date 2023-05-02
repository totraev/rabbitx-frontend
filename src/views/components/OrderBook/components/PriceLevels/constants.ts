import { Config } from "../../types";

type PartialConfig = Pick<Config, 'columns' | 'sortOrder' | 'renderDirection'>

export const styles = {
  bid: {
    font: "12px Arial",
    color: "#ffffff",
    rowHeight: 20,
    removalColor: '#3b3c3d',
    priceColor: "#15eaab",
    bgColor: "#123a42",
  },
  ask: {
    font: "12px Arial",
    color: "#ffffff",
    rowHeight: 20,
    removalColor: '#3b3c3d',
    priceColor: "#ff465d",
    bgColor: "#321e2c",
  },
};

export const config: { bid: PartialConfig, ask: PartialConfig } = {
  bid: {
    columns: [
      { key: "size", width: 33.3, align: "left", digits: 4 },
      { key: "price", width: 33.3, align: "right", digits: 0 },
      { key: "total", width: 33.3, align: "right", digits: 2 },
    ],
    sortOrder: "DESC",
    renderDirection: "start-top",
  },
  ask: {
    columns: [
      { key: "size", width: 33.3, align: "left", digits: 4 },
      { key: "price", width: 33.3, align: "right", digits: 0 },
      { key: "total", width: 33.3, align: "right", digits: 2 },
    ],
    sortOrder: "ASC",
    renderDirection: "start-bottom",
  },
};
