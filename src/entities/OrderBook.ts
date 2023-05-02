import { createAtom, transaction } from "mobx";
import AVLTree from "avl";

import { PriceLevel } from "./PriceLevel";

export class OrderBook {
  private atom = createAtom("OrderBook");

  private tree = new AVLTree<number, PriceLevel>();
  private map = new Map<string, PriceLevel>();

  get list() {
    this.atom.reportObserved();

    return this.tree.values();
  }

  get maxPrice() {
    this.atom.reportObserved();

    return this.tree.maxNode()?.data?.price;
  }

  get minPrice() {
    this.atom.reportObserved();

    return this.tree.minNode()?.data?.price;
  }

  add(price: string, size: string) {
    const priceLevel = new PriceLevel(price, size);

    this.map.set(price, priceLevel);
    this.tree.insert(priceLevel.price, priceLevel);

    this.atom.reportChanged();
  }

  remove(price: string) {
    const priceLevel = this.map.get(price);

    if (priceLevel) {
      this.tree.remove(priceLevel.price);
      this.map.delete(price);

      this.atom.reportChanged();
    }
  }

  update(price: string, size: string) {
    if (size === "0") {
      this.remove(price);
      return;
    }

    if (this.map.has(price)) {
      this.map.get(price)?.update(size);
    } else {
      this.add(price, size);
    }
  }

  clear() {
    this.map.clear();
    this.tree.clear();

    this.atom.reportChanged();
  }

  bulkAdd(data: [price: string, size: string][]) {
    transaction(() => {
      this.clear();

      for (const [price, size] of data) {
        this.add(price, size);
      }
    });
  }

  bulkUpdate(updates: [price: string, size: string][]) {
    transaction(() => {
      for (const [price, size] of updates) {
        this.update(price, size);
      }
    });
  }
}
