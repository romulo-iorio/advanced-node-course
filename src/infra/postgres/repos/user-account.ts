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

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params
  ): Promise<void> {
    await this.pgUserRepo.save({
      facebookId: params.facebookId,
      email: params.email,
      name: params.name,
    });
  }
}
