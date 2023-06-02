import { DataSource } from "typeorm";

import { PgUserAccountRepository } from "@/infra/postgres/repos";

export const makePgUserAccountRepository = (): PgUserAccountRepository => {
  const dataSource = new DataSource({});
  return new PgUserAccountRepository(dataSource);
};
