import type { DataSource, Repository } from "typeorm";
import type { IBackup } from "pg-mem";

import type { LoadUserAccountRepository } from "@/data/contracts/repos";
import { PgUserAccountRepository } from "@/infra/postgres/repos";
import { makeFakeDb } from "@/tests/infra/postgres/mocks";
import { PgUser } from "@/infra/postgres/entities";

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
