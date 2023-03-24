import type {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { FacebookAuthentication } from "@/domain/features";

import { AuthenticationError } from "@/domain/errors";

type UserAccount = LoadUserAccountRepository & CreateFacebookAccountRepository;

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookUserApi: LoadFacebookUserApi,
    private readonly userAccountRepo: UserAccount
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookUserApi.loadUser(params);

    if (fbData === undefined) return new AuthenticationError();

    const { email } = fbData;
    await this.userAccountRepo.load({ email });

    await this.userAccountRepo.createFromFacebook(fbData);

    return new AuthenticationError();
  }
}
