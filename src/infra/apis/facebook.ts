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
    const appTOken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        grant_type: "client_credentials",
        client_secret: this.clientSecret,
        client_id: this.clientId,
      },
    });

    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appTOken.access_token,
        input_token: params.token,
      },
    });

    await this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ["id", "name", "email"].join(","),
        access_token: params.token,
      },
    });
  }
}
