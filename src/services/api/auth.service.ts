import axios from "axios";

import type { Signer } from "../../interfaces/signer.interface";
import type { AuthRes } from '../../types/auth'; 
import signer from "./metamask.service";
import { getExpirationTimestamp, getOnboardingMessage, prepareSignature } from '../../utils/auth';

export class AuthService {
  constructor(private signer: Signer) {}

  async getToken(): Promise<string | undefined> {
    const expirationTimestamp = getExpirationTimestamp();
    const message = getOnboardingMessage(expirationTimestamp);

    await this.signer.init();
    
    const [signature, wallet] = await Promise.all([
      this.signer.signMessage(message),
      this.signer.getPublicKey(),
    ]);

    const { data } = await axios.post<AuthRes>(
      "/api/onboarding",
      { signature: prepareSignature(signature), wallet, is_client: true },
      { headers: { "rbt-ts": expirationTimestamp } }
    );

    return data.result?.[0]?.jwt
  }
}

const authService = new AuthService(signer);

export default authService;
