import axios from "axios";

import { AxiosHttpClient } from "@/infra/http";

jest.mock("axios");

describe("AxiosHttpClient", () => {
  let fakeAxios: jest.Mocked<typeof axios>;
  let sut: AxiosHttpClient;

  let params: object;
  let url: string;

  beforeAll(() => {
    params = { any: "any" };
    url = "any_url";

    fakeAxios = axios as jest.Mocked<typeof axios>;

    fakeAxios.get.mockResolvedValue({
      data: "any_data",
      status: 200,
    });
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

    it("should return data on success", async () => {
      const result = await sut.get({ url, params });

      expect(result).toEqual("any_data");
    });

    it("should rethrow if get throws", async () => {
      const error = new Error("http_error");

      fakeAxios.get.mockRejectedValueOnce(error);

      const promise = sut.get({ url, params });

      await expect(promise).rejects.toThrow(error);
    });
  });
});
