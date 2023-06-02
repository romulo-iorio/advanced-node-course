import { FacebookAuthenticationService } from "@/data/contracts/services";
import {
  makePgUserAccountRepository,
  makeJwtTokenGenerator,
  makeFacebookApi,
} from "@/main/factories";

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
