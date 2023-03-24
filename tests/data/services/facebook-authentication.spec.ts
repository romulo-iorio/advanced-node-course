import { mock, type MockProxy } from "jest-mock-extended";

import type { LoadUserAccountRepository } from "@/data/contracts/repos";
import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import { AuthenticationError } from "@/domain/errors";

describe("FacebookAuthenticationService", () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  let sut: FacebookAuthenticationService;
  const email = "any_fb_email";
  const token = "any_token";

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      facebookId: "any_fb_id",
      name: "any_fb_name",
      email,
    });

    loadUserAccountRepo = mock<LoadUserAccountRepository>();

    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo
    );
  });

  it("Should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("Should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("Should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
});
