import { mock, type MockProxy } from "jest-mock-extended";

import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import { AuthenticationError } from "@/domain/errors";

const MOCK_PARAMS: LoadFacebookUserApi.Params = { token: "any_token" };

describe("FacebookAuthenticationService", () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  });

  it("Should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform(MOCK_PARAMS);

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(MOCK_PARAMS);
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("Should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform(MOCK_PARAMS);

    expect(authResult).toEqual(new AuthenticationError());
  });
});
