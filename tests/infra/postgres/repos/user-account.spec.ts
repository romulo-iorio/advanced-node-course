import type { DataSource, Repository } from "typeorm";
import type { IBackup } from "pg-mem";

import { PgUserAccountRepository } from "@/infra/postgres/repos";
import { makeFakeDb } from "@/tests/infra/postgres/mocks";
import { PgUser } from "@/infra/postgres/entities";

describe("PgUserAccountRepository", () => {
  let sut: PgUserAccountRepository;
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

  describe("load", () => {
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

  describe("saveWithFacebook", () => {
    it("should create an account if id is undefined", async () => {
      await sut.saveWithFacebook({
        facebookId: "any_fb_id",
        email: "any_email",
        name: "any_name",
      });
      const pgUser = await pgUserRepo.findOneBy({ email: "any_email" });

      expect(pgUser?.id).toBe(1);
    });

    it("should update account if id is defined", async () => {
      await pgUserRepo.save({
        facebookId: "any_fb_id",
        email: "any_email",
        name: "any_name",
      });

      await sut.saveWithFacebook({
        facebookId: "new_fb_id",
        email: "new_email",
        name: "new_name",
        id: "1",
      });

      const pgUser = await pgUserRepo.findOneBy({ id: 1 });

      expect(pgUser).toEqual({
        facebookId: "new_fb_id",
        email: "any_email",
        name: "new_name",
        id: 1,
      });
    });
  });
});
