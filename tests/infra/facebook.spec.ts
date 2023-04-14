import { type MockProxy, mock } from "jest-mock-extended";

import type { HttpGetClient } from "@/infra/http";
import { FacebookApi } from "@/infra/apis";

describe("FacebookApi", () => {
  let clientId: string;
  let clientSecret: string;
  let sut: FacebookApi;
  let httpClient: MockProxy<HttpGetClient>;

  beforeAll(() => {
    httpClient = mock<HttpGetClient>();
    clientSecret = "any_client_secret";
    clientId = "any_client_id";
  });

  beforeEach(() => {
    jest.clearAllMocks();

    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it("should get app token", async () => {
    await sut.loadUser({ token: "any_client_token" });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/oauth/access_token",
      params: {
        grant_type: "client_credentials",
        client_secret: clientSecret,
        client_id: clientId,
      },
    });
  });
});
