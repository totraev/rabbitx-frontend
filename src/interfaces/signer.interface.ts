export interface Signer {
  init(): Promise<void>;
  getPublicKey(): Promise<string>;
  signMessage(message: string): Promise<string>;
}