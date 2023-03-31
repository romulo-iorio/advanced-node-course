import { mock, type MockProxy } from "jest-mock-extended";

import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { TokenGenerator } from "@/data/contracts/crypto";
import type { UserAccount } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import { AccessToken, FacebookAccount } from "@/domain/models";
import { AuthenticationError } from "@/domain/errors";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthenticationService", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo: MockProxy<UserAccount>;
  let crypto: MockProxy<TokenGenerator>;
  let sut: FacebookAuthenticationService;

  let token: string;
  let facebookId: string;
  let email: string;
  let name: string;
  let id: string;
  let fbData: { facebookId: string; email: string; name: string };

  beforeAll(() => {
    token = "any_token";
    facebookId = "any_fb_id";
    email = "any_fb_email";
    name = "any_fb_name";
    id = "any_account_id";
    fbData = { facebookId, email, name };

    facebookApi = mock<LoadFacebookUserApi>();
    facebookApi.loadUser.mockResolvedValue(fbData);

    userAccountRepo = mock<UserAccount>();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id });

    crypto = mock<TokenGenerator>();
    crypto.generateToken.mockResolvedValue("any_generated_token");
  });

  beforeEach(() => {
    // jest.clearAllMocks();
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    );
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

  it("Should call TokenGenerator with correct params", async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("Should return an AccessToken on success", async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken("any_generated_token"));
  });

  it("Should rethrow if LoadFacebookUserApi throws", async () => {
    const mockError = new Error("fb_error");

    facebookApi.loadUser.mockRejectedValueOnce(mockError);

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(mockError);
  });

  it("Should rethrow if LoadUserAccountRepository throws", async () => {
    const mockError = new Error("load_error");

    userAccountRepo.load.mockRejectedValueOnce(mockError);

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(mockError);
  });

  it("Should rethrow if SaveFacebookAccountRepository throws", async () => {
    const mockError = new Error("save_error");

    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(mockError);

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(mockError);
  });

  it("Should rethrow if TokenGenerator throws", async () => {
    const mockError = new Error("token_error");

    crypto.generateToken.mockRejectedValueOnce(mockError);

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(mockError);
  });
});
