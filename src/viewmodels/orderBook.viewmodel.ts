import { makeObservable, observable, computed, action } from 'mobx';

import orderBookService, { type OrderBookService } from "../services/orderBook.service";

class OrderBookViewModel {
  private readonly priceSteps = [0.05, 0.1, 0.5, 1, 5, 10, 50];
  priceStepIndex = 3;

  constructor(private orderBookService: OrderBookService) {
    makeObservable(this, {
      priceStepIndex: observable,
      priceStep: computed,
      asks: computed,
      bids: computed,
      spread: computed,
      increasePriceStep: action,
      decreasePriceStep: action,
      reset: action
    });
  }

  get priceStep() {
    return this.priceSteps[this.priceStepIndex];
  }

  get maxPriceStep() {
    return this.priceSteps[this.priceSteps.length - 1];
  }

  get minPriceStep() {
    return this.priceSteps[0];
  }

  get spread () {
    const minAsk = this.asks[0]?.price ?? 0;
    const maxBid = this.bids[0]?.price ?? 0;

    return minAsk - maxBid;
  }

  get asks() {
    return this.orderBookService.aggregateAsks(this.priceStep);
  }

  get bids() {
    return this.orderBookService.aggregateBids(this.priceStep);
  }

  init(symbol: string) {
    this.orderBookService.clear();
    this.orderBookService.subscribe(symbol);
  }

  reset() {
    this.orderBookService.clear();
    this.orderBookService.unsubscribe();

    this.priceStepIndex = 3;
  }

  increasePriceStep = () => {
    if (this.priceStep < this.maxPriceStep) {
      this.priceStepIndex++;
    }
  }

  decreasePriceStep = () => {
    if (this.priceStep > this.minPriceStep) {
      this.priceStepIndex--;
    }
  }
}

const orderBookViewModel = new OrderBookViewModel(orderBookService);

export default orderBookViewModel;