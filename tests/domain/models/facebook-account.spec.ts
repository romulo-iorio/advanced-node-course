import { FacebookAccount } from "@/domain/models";

describe("FacebookAccount", () => {
  const fbData = {
    facebookId: "any_fb_id",
    email: "any_fb_email",
    name: "any_fb_name",
  };

  it("should create with facebook data only", () => {
    const sut = new FacebookAccount(fbData);

    expect(sut).toEqual(fbData);
  });

  it("should update name if it's empty", () => {
    const accountData = { id: "any_id" };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: "any_id",
      facebookId: "any_fb_id",
      email: "any_fb_email",
      name: "any_fb_name",
    });
  });

  it("should not update name if it's not empty", () => {
    const accountData = { id: "any_id", name: "any_name" };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      facebookId: "any_fb_id",
      email: "any_fb_email",
      name: "any_name",
      id: "any_id",
    });
  });
});
