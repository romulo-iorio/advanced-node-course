import type { DataSource, Repository } from "typeorm";

import type {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo: Repository<PgUser>;

  constructor(dataSource: DataSource) {
    this.pgUserRepo = dataSource.getRepository(PgUser);
  }

  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOneBy({ email: params.email });

    if (pgUser == null) return;

    return { id: pgUser.id.toString(), name: pgUser.name ?? undefined };
  }

  async create(params: SaveFacebookAccountRepository.Params): Promise<void> {
    await this.pgUserRepo.save({
      facebookId: params.facebookId,
      email: params.email,
      name: params.name,
    });
  }

  async update(params: SaveFacebookAccountRepository.Params): Promise<void> {
    await this.pgUserRepo.update(
      { id: parseInt(`${params.id ?? ""}`, 10) },
      { facebookId: params.facebookId, name: params.name }
    );
  }

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params
  ): Promise<void> {
    if (params.id == null) return this.create(params);

    await this.update(params);
  }
}
