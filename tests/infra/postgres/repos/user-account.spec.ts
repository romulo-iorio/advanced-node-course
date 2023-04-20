import type { DataSource, Repository } from "typeorm";
import type { IBackup } from "pg-mem";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { newDb } from "pg-mem";

import type { LoadUserAccountRepository } from "@/data/contracts/repos";

@Entity({ name: "usuarios" })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "nome", nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: "id_facebook", nullable: true })
  facebookId?: string;
}

class PgUserAccountRepository implements LoadUserAccountRepository {
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

describe("PgUserAccountRepository", () => {
  describe("load", () => {
    let sut: LoadUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;
    let userDataSource: DataSource;
    let backup: IBackup;

    beforeAll(async () => {
      const db = newDb({
        autoCreateForeignKeyIndices: true,
      });

      db.public.registerFunction({
        implementation: () => "test",
        name: "current_database",
      });

      userDataSource = await db.adapters.createTypeormDataSource({
        type: "postgres",
        entities: [PgUser],
      });

      await userDataSource.initialize();
      await userDataSource.synchronize();

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
