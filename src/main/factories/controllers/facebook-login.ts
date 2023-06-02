import { makeFacebookAuthenticationService } from "@/main/factories/services";
import { FacebookLoginController } from "@/application/controllers";

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthService = makeFacebookAuthenticationService();
  return new FacebookLoginController(facebookAuthService);
};
