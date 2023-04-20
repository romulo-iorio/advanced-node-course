import type { DataSource } from "typeorm";

import type { LoadUserAccountRepository } from "@/data/contracts/repos";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor(private readonly dataSource: DataSource) {}

  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = this.dataSource.getRepository(PgUser);
    const pgUser = await pgUserRepo.findOneBy({ email: params.email });

    if (pgUser == null) return;

    return { id: pgUser.id.toString(), name: pgUser.name ?? undefined };
  }
}
