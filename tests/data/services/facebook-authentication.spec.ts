import { mock, type MockProxy } from "jest-mock-extended";

import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { UserAccount } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAccount } from "@/domain/models";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthenticationService", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo: MockProxy<UserAccount>;

  let sut: FacebookAuthenticationService;

  const facebookId = "any_fb_id";
  const email = "any_fb_email";
  const name = "any_fb_name";
  const token = "any_token";
  // const id = "any_id";

  const fbData = { facebookId, email, name };

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>();
    facebookApi.loadUser.mockResolvedValue(fbData);

    userAccountRepo = mock<UserAccount>();
    userAccountRepo.load.mockResolvedValue(undefined);

    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
  });

  it("Should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("Should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("Should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it("Should call SaveFacebookAccountRepository with FacebookAccount", async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: "any",
    }));
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: "any",
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});
