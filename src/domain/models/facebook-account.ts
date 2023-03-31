type FacebookData = {
  facebookId: string;
  email: string;
  name: string;
};

type AccountData = { name?: string; id?: string };

export class FacebookAccount {
  readonly id?: string;
  facebookId: string;
  email: string;
  name: string;

  constructor(fbData: FacebookData, accountData?: AccountData) {
    this.id = accountData?.id;
    this.name = accountData?.name ?? fbData.name;
    this.facebookId = fbData.facebookId;
    this.email = fbData.email;
  }
}
