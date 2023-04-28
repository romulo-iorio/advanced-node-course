import type { DataSource, Repository } from "typeorm";

import type {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo: Repository<PgUser>;

  constructor(dataSource: DataSource) {
    this.pgUserRepo = dataSource.getRepository(PgUser);
  }

  async load(params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOneBy({ email: params.email });

    if (pgUser == null) return;

    return { id: pgUser.id.toString(), name: pgUser.name ?? undefined };
  }

  async create(params: SaveParams): Promise<SaveResult> {
    const pgUser = await this.pgUserRepo.save({
      facebookId: params.facebookId,
      email: params.email,
      name: params.name,
    });

    return { id: pgUser.id.toString() };
  }

  async update(params: SaveParams): Promise<void> {
    const id = parseInt(`${params.id ?? ""}`, 10);

    await this.pgUserRepo.update(
      { id },
      { facebookId: params.facebookId, name: params.name }
    );
  }

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    if (params.id == null) return this.create(params);

    await this.update(params);
    return { id: params.id };
  }
}
