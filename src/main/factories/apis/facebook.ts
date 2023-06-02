import { facebookApi as facebookApiEnv } from "@/main/config/env";
import { makeAxiosClient } from "@/main/factories/http";
import { FacebookApi } from "@/infra/apis";

const { clientId, clientSecret } = facebookApiEnv;

export const makeFacebookApi = (): FacebookApi => {
  const axiosClient = makeAxiosClient();
  return new FacebookApi(axiosClient, clientId, clientSecret);
};
