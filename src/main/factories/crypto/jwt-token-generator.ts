import { JwtTokenGenerator } from "@/infra/crypto";
import { jwtSecret } from "@/main/config/env";

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  return new JwtTokenGenerator(jwtSecret);
};
