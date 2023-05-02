import { Subscription } from "centrifuge";
import { createNanoEvents, type Unsubscribe } from 'nanoevents';

import { ConnectionService } from "./connection.service";

type Channel = 'orderbook';

type EventMap<Data> = {
  data: (data: Data) => void;
  snapshot: (data: Data) => void;
}

export class SubscriptionService<Data = any> {
  private subscription: Subscription | null = null;
  private sequence: number = 0;
  private symbol = '';

  private ee = createNanoEvents<EventMap<Data>>();
  private listenersArr: Unsubscribe[] = [];

  constructor(private connection: ConnectionService, private channelName: Channel) {}

  subscribe(symbol: string) {
    this.unsubscribe();
    this.symbol = `${this.channelName}:${symbol}`

    this.subscription = this.connection.createSubscribtion(this.symbol);

    this.subscription.on('subscribed', (ctx) => {
      this.sequence = ctx.data.sequence;
      this.ee.emit('snapshot', ctx.data);
    });

    this.subscription.on('publication', (ctx) => {
      if (ctx.data.sequence - this.sequence === 1) {
        this.ee.emit('data', ctx.data);
        this.sequence = ctx.data.sequence;
      } else {
        this.subscribe(this.symbol);
      }
    });

    this.subscription.subscribe();
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription.removeAllListeners();
      this.connection.removeSubscribtion(this.subscription);

      this.subscription = null;
    }
  }

  on<K extends keyof EventMap<Data>>(name: K, handler: EventMap<Data>[K]) {
    this.listenersArr.push(this.ee.on(name, handler));
  }

  destroy() {
    this.unsubscribe();
    this.listenersArr.forEach(unsubscribe => unsubscribe());
  }
}