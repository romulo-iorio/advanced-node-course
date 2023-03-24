import { mock, type MockProxy } from "jest-mock-extended";

import type {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import { AuthenticationError } from "@/domain/errors";

describe("FacebookAuthenticationService", () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>;

  let sut: FacebookAuthenticationService;

  const facebookId = "any_fb_id";
  const email = "any_fb_email";
  const name = "any_fb_name";
  const token = "any_token";

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadFacebookUserApi.loadUser.mockResolvedValue({ facebookId, email, name });

    loadUserAccountRepo = mock<LoadUserAccountRepository>();

    createFacebookAccountRepo = mock<CreateFacebookAccountRepository>();

    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo
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

  it("Should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined", async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      facebookId,
      email,
      name,
    });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(
      1
    );
  });
});
