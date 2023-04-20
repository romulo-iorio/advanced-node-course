import type { DataSource, Repository } from "typeorm";
import type { IBackup, IMemoryDb } from "pg-mem";
import { newDb } from "pg-mem";

import type { LoadUserAccountRepository } from "@/data/contracts/repos";
import { PgUserAccountRepository } from "@/infra/postgres/repos";
import { PgUser } from "@/infra/postgres/entities";

type FakeDbReturn = {
  dataSource: DataSource;
  db: IMemoryDb;
};

const makeFakeDb = async (entities?: unknown[]): Promise<FakeDbReturn> => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => "test",
    name: "current_database",
  });

  const dataSource = await db.adapters.createTypeormDataSource({
    type: "postgres",
    entities: entities ?? ["src/infra/postgres/entities/index.ts"],
  });

  await dataSource.initialize();
  await dataSource.synchronize();

  return { db, dataSource };
};

describe("PgUserAccountRepository", () => {
  describe("load", () => {
    let sut: LoadUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;
    let userDataSource: DataSource;
    let backup: IBackup;

    beforeAll(async () => {
      const { db, dataSource } = await makeFakeDb();
      userDataSource = dataSource;
      backup = db.backup();

      pgUserRepo = userDataSource.getRepository(PgUser);
    });

    beforeEach(() => {
      backup.restore();
      sut = new PgUserAccountRepository(userDataSource);
    });

    it("should return an account if email exists", async () => {
      await pgUserRepo.save({ email: "any_email" });

      const account = await sut.load({ email: "any_email" });

      expect(account).toEqual({ id: "1" });
    });

    it("should return an account if email exists", async () => {
      const account = await sut.load({ email: "any_email" });

      expect(account).toBeUndefined();
    });
  });
});
