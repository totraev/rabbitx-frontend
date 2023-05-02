import orderBookModel, { type OrderBookModel } from '../models/orderBook.model';
import { SubscriptionService } from './api/subscription.service';
import connection, { ConnectionService } from './api/connection.service';

import type { IPriceLevel } from '../types/orderBook';
import { aggregatePriceLevels } from '../utils/price';
import { OrderBookData } from '../types/orderBook';


export class OrderBookService {
  private subscription = new SubscriptionService<OrderBookData>(this.connection, 'orderbook');

  constructor(private orderBookModel: OrderBookModel, private connection: ConnectionService) {
    this.subscription.on('snapshot', (data) => {
      this.orderBookModel.add(data);
    })

    this.subscription.on('data', (data) => {
      this.orderBookModel.update(data);
    })
  }

  subscribe(symbol: string) {
    this.subscription.subscribe(symbol);
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  aggregateAsks(priceStep: number): IPriceLevel[] {
    return aggregatePriceLevels(this.orderBookModel.asksList, priceStep, 'ask');
  }

  aggregateBids(priceStep: number): IPriceLevel[] {
    return aggregatePriceLevels(this.orderBookModel.bidsList, priceStep, 'bid');
  }

  clear() {
    this.orderBookModel.clear();
  }
}

const orderBookService = new OrderBookService(orderBookModel, connection);

export default orderBookService