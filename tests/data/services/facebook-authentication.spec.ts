import { mock } from "jest-mock-extended";

import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import { AuthenticationError } from "@/domain/errors";

const MOCK_PARAMS: LoadFacebookUserApi.Params = { token: "any_token" };

describe("FacebookAuthenticationService", () => {
  it("Should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    await sut.perform(MOCK_PARAMS);

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(MOCK_PARAMS);
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("Should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>();

    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const authResult = await sut.perform(MOCK_PARAMS);

    expect(authResult).toEqual(new AuthenticationError());
  });
});
