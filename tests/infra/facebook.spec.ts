import { type MockProxy, mock } from "jest-mock-extended";

import type { HttpGetClient } from "@/infra/http";
import { FacebookApi } from "@/infra/apis";

describe("FacebookApi", () => {
  let clientSecret: string;
  let clientToken: string;
  let clientId: string;
  let appToken: string;
  let baseUrl: string;

  let sut: FacebookApi;
  let httpClient: MockProxy<HttpGetClient>;

  beforeAll(() => {
    httpClient = mock<HttpGetClient>();
    clientSecret = "any_client_secret";
    clientToken = "any_client_token";
    clientId = "any_client_id";
    appToken = "any_app_token";
    baseUrl = "https://graph.facebook.com";
  });

  beforeEach(() => {
    jest.clearAllMocks();

    httpClient.get.mockResolvedValueOnce({
      access_token: appToken,
    });

    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it("should get app token", async () => {
    await sut.loadUser({ token: clientToken });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}/oauth/access_token`,
      params: {
        grant_type: "client_credentials",
        client_secret: clientSecret,
        client_id: clientId,
      },
    });
  });

  it("should get debug token", async () => {
    await sut.loadUser({ token: clientToken });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}/debug_token`,
      params: { input_token: clientToken, access_token: appToken },
    });
  });
});
