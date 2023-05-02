import { makeObservable, computed, action } from "mobx";

import { OrderBook } from "../entities/OrderBook";

type Snapshot = {
  asks?: [price: string, size: string][];
  bids?: [price: string, size: string][];
};

export class OrderBookModel {
  private asks = new OrderBook();
  private bids = new OrderBook();

  constructor() {
    makeObservable(this, {
      asksList: computed,
      bidsList: computed,
      add: action,
      update: action,
      clear: action,
    });
  }

  get asksList() {
    return this.asks.list;
  }

  get bidsList() {
    return this.bids.list;
  }

  add({ asks, bids }: Snapshot) {
    this.clear();

    if (asks) {
      this.asks.bulkAdd(asks);
    }

    if (bids) {
      this.bids.bulkAdd(bids);
    }
  }

  update({ asks, bids }: Snapshot) {
    if (asks) {
      this.asks.bulkUpdate(asks);
    }

    if (bids) {
      this.bids.bulkUpdate(bids);
    }
  }

  clear() {
    this.asks.clear();
    this.bids.clear();
  }
}

const orderBookModel = new OrderBookModel();

export default orderBookModel;
