import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { FacebookAuthentication } from "@/domain/features";
import type { UserAccount } from "@/data/contracts/repos";

import { AuthenticationError } from "@/domain/errors";

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
    const accountData = await this.userAccountRepo.load({ email });

    const name = accountData?.name ?? fbData.name;

    await this.userAccountRepo.saveWithFacebook({
      facebookId: fbData.facebookId,
      id: accountData?.id,
      email,
      name,
    });

    return new AuthenticationError();
  }
}
