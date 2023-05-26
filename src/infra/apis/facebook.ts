import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { HttpGetClient } from "../http";

type AppToken = { access_token: string };
type DebugToken = { data: { user_id: string } };
type UserInfo = { id: string; email: string; name: string };

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = "https://graph.facebook.com";
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  public async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    try {
      const userInfo = await this.getUserInfo(params.token);

      return {
        facebookId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
      };
    } catch {
      return undefined;
    }
  }

  private async getAppToken(): Promise<AppToken> {
    const url = `${this.baseUrl}/oauth/access_token`;

    const params = {
      grant_type: "client_credentials",
      client_secret: this.clientSecret,
      client_id: this.clientId,
    };

    return this.httpClient.get<AppToken>({ url, params });
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken();

    const url = `${this.baseUrl}/debug_token`;

    const params = {
      access_token: appToken.access_token,
      input_token: clientToken,
    };

    return this.httpClient.get<DebugToken>({ url, params });
  }

  private async getUserInfo(clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken);

    const userId = debugToken.data.user_id;

    const url = `${this.baseUrl}/${userId}`;

    const fields = ["id", "name", "email"].join(",");
    const params = { fields, access_token: clientToken };

    return this.httpClient.get<UserInfo>({ url, params });
  }
}
