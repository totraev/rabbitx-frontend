import { makeObservable, observable, computed, action } from 'mobx';

export class PriceLevel {
  readonly id: string;
  readonly price: number;
  size: number;

  constructor(price: string, size: string) {
    makeObservable(this, {
      size: observable,
      total: computed,
      update: action
    });

    this.id = price;
    this.price = parseFloat(price);
    this.size = parseFloat(size);
  }

  get total() {
    return this.price * this.size;
  }

  update(size: string | number) {
    this.size = typeof size === 'string' ? parseFloat(size) : size;
  }
}