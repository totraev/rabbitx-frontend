import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

import type { Signer } from "../../interfaces/signer.interface";

export class MetaMaskSigner implements Signer {
  private provider: ethers.providers.Web3Provider | null = null;
  private onboarding = new MetaMaskOnboarding();

  async init(): Promise<void> {
    if (this.provider) {
      return;
    }

    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      this.onboarding.startOnboarding();
      throw new Error('MetaMask is not installed');
    }

    this.onboarding.stopOnboarding();
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async getPublicKey(): Promise<string> {
    const accounts = await this.provider?.listAccounts();

    return accounts?.[0] ?? '';
  }

  async signMessage(message: string): Promise<string> {    
    const signature = await this.provider?.getSigner().signMessage(message)

    return signature ?? '';
  }
}

const signer = new MetaMaskSigner();

export default signer;