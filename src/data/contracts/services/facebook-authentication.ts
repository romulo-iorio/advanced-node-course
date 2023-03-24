import type {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { FacebookAuthentication } from "@/domain/features";

import { AuthenticationError } from "@/domain/errors";

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookAccountRepo: CreateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);

    if (fbData === undefined) return new AuthenticationError();

    const { email } = fbData;
    await this.loadUserAccountRepo.load({ email });

    await this.createFacebookAccountRepo.createFromFacebook(fbData);

    return new AuthenticationError();
  }
}
