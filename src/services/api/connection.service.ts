import { Centrifuge, type Subscription, type ClientEvents } from 'centrifuge';

import { WS_URL } from '../../config';

export class ConnectionService {
  private client = new Centrifuge(WS_URL, { getToken: async () => this.getToket?.() ?? '' });

  getToket: (() => Promise<string>) | null = null;

  async connect(): Promise<void> {
    this.client.connect()

    return this.client.ready()
  }

  disconnect(): void {
    this.client.disconnect();
  }

  createSubscribtion(channelName: string): Subscription {
    return this.client.newSubscription(channelName);
  }

  removeSubscribtion(sub: Subscription): void {
    this.client.removeSubscription(sub);
  }

  on(name: 'state', handler: ClientEvents['state']): void {
    this.client.on(name, handler);
  }

  removeListener(name: 'state', handler: ClientEvents['state']): void {
    this.client.removeListener(name, handler);
  }

  removeAllListeners(): void {
    this.client.removeAllListeners('state');
  }
}

const connection = new ConnectionService();

export default connection;