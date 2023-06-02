import { FacebookAuthenticationService } from "@/data/contracts/services";
import { makePgUserAccountRepository } from "@/main/factories/repos";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";
import { makeFacebookApi } from "@/main/factories/apis";

export const makeFacebookAuthenticationService =
  (): FacebookAuthenticationService => {
    const facebookApi = makeFacebookApi();
    const pgUserAccountRepo = makePgUserAccountRepository();
    const tokenGenerator = makeJwtTokenGenerator();

    return new FacebookAuthenticationService(
      facebookApi,
      pgUserAccountRepo,
      tokenGenerator
    );
  };
