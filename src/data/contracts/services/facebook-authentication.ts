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

    if (accountData?.name !== undefined) {
      await this.userAccountRepo.updateWithFacebook({
        facebookId: fbData.facebookId,
        name: accountData.name,
        id: accountData.id,
      });
    } else {
      await this.userAccountRepo.createFromFacebook(fbData);
    }

    return new AuthenticationError();
  }
}
