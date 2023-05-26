const {
  FB_TEST_USER_TOKEN,
  FB_TEST_USER_EMAIL,
  FB_TEST_USER_NAME,
  FB_CLIENT_SECRET,
  FB_TEST_USER_ID,
  FB_CLIENT_ID,
} = process.env;

export const facebookApi = {
  clientSecret: FB_CLIENT_SECRET ?? "",
  clientId: FB_CLIENT_ID ?? "",
  testData: {
    token: FB_TEST_USER_TOKEN ?? "",
    user: {
      email: FB_TEST_USER_EMAIL ?? "",
      name: FB_TEST_USER_NAME ?? "",
      id: FB_TEST_USER_ID ?? "",
    },
  },
};

export default { facebookApi };
