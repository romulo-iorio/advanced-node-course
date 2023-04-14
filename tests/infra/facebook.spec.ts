import { type MockProxy, mock } from "jest-mock-extended";

import type { LoadFacebookUserApi } from "@/data/contracts/apis";

class FacebookApi {
  private readonly baseUrl = "https://graph.facebook.com";
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        grant_type: "client_credentials",
        client_secret: this.clientSecret,
        client_id: this.clientId,
      },
    });
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>;
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: object;
  };
}

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
