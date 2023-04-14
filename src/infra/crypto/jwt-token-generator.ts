import { sign } from "jsonwebtoken";

import type { TokenGenerator } from "@/data/contracts/crypto";

export class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(
    params: TokenGenerator.Params
  ): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;

    const data = { key: params.key };

    const options = { expiresIn: expirationInSeconds };

    return sign(data, this.secret, options);
  }
}
