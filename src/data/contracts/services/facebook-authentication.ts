import type { UserAccount as UserAccountRepo } from "@/data/contracts/repos";
import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { FacebookAuthentication } from "@/domain/features";
import type { TokenGenerator } from "@/data/contracts/crypto";

import { AuthenticationError } from "@/domain/errors";
import { FacebookAccount } from "@/domain/models";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookUserApi: LoadFacebookUserApi,
    private readonly userAccountRepo: UserAccountRepo,
    private readonly crypto: TokenGenerator
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookUserApi.loadUser(params);

    if (fbData === undefined) return new AuthenticationError();

    const { email } = fbData;
    const accountData = await this.userAccountRepo.load({ email });

    const fbAccount = new FacebookAccount(fbData, accountData);

    const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount);

    await this.crypto.generateToken({ key: id });

    return new AuthenticationError();
  }
}
