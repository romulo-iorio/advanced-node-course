export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Data = {
    id: string;
    name?: string;
  };

  export type Result = undefined | Data;
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (
    params: SaveFacebookAccountRepository.Params
  ) => Promise<void>;
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    facebookId: string;
    email: string;
    name: string;
    id?: string;
  };
}

export type UserAccount = LoadUserAccountRepository &
  SaveFacebookAccountRepository;
