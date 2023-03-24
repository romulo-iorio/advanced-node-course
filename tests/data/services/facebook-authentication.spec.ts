import { mock, type MockProxy } from "jest-mock-extended";

import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import { AuthenticationError } from "@/domain/errors";

const MOCK_PARAMS: LoadFacebookUserApi.Params = { token: "any_token" };

type SutTypes = {
  sut: FacebookAuthenticationService;
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
};

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>();
  const sut = new FacebookAuthenticationService(loadFacebookUserApi);
  return { sut, loadFacebookUserApi };
};

describe("FacebookAuthenticationService", () => {
  it("Should call LoadFacebookUserApi with correct params", async () => {
    const { sut, loadFacebookUserApi } = makeSut();

    await sut.perform(MOCK_PARAMS);

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(MOCK_PARAMS);
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("Should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    const { sut, loadFacebookUserApi } = makeSut();

    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform(MOCK_PARAMS);

    expect(authResult).toEqual(new AuthenticationError());
  });
});
