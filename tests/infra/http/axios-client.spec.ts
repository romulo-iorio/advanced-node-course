import axios from "axios";

import type { HttpGetClient } from "@/infra/http";

jest.mock("axios");

class AxiosHttpClient {
  async get(args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, { params: args.params });
  }
}

describe("AxiosHttpClient", () => {
  let fakeAxios: jest.Mocked<typeof axios>;
  let sut: AxiosHttpClient;

  let params: object;
  let url: string;

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;

    params = { any: "any" };
    url = "any_url";
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  describe("get", () => {
    it("should call get with correct params", async () => {
      await sut.get({ url, params });

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });

      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
