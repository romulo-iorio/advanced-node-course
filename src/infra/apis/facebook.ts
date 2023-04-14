import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { HttpGetClient } from "../http";

export class FacebookApi {
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
