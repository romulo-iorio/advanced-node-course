import { facebookApi } from "@/main/config/env";
import { AxiosHttpClient } from "@/infra/http";
import { FacebookApi } from "@/infra/apis";

const { clientId, clientSecret, testData } = facebookApi;
const { token, user } = testData;
const { id: facebookId, email, name } = user;

describe("Facebook Api Integration Tests", () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(axiosClient, clientId, clientSecret);
  });

  it("should return a Facebook User if token is valid", async () => {
    const fbUser = await sut.loadUser({ token });

    expect(fbUser).toEqual({ facebookId, email, name });
  });

  it("should return undefined if token is invalid", async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(axiosClient, clientId, clientSecret);

    const fbUser = await sut.loadUser({ token: "invalid" });

    expect(fbUser).toBeUndefined();
  });
});
