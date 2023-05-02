import { ethers } from 'ethers';

import { EXPIRES, ONBOARDING_MESSAGE } from '../config';

export function getExpirationTimestamp(): number {
  return Math.floor(Date.now() / 1000) + EXPIRES;
}

export function getOnboardingMessage(expirationTimestamp: number): string {
  return `${ONBOARDING_MESSAGE}\n${expirationTimestamp}`;
}

export function prepareSignature(signature: string): string {
  const bytes = ethers.utils.arrayify(signature);
  bytes[bytes.length - 1] = bytes[bytes.length - 1] % 27;

  return ethers.utils.hexlify(bytes)
}