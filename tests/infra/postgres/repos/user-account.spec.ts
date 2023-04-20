import {
  type DataSource,
  PrimaryGeneratedColumn,
  Column,
  Entity,
} from "typeorm";
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
  let sut: LoadUserAccountRepository;
  let userDataSource: DataSource;

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
  });

  beforeEach(() => {
    sut = new PgUserAccountRepository(userDataSource);
  });

  describe("load", () => {
    it("should return an account if email exists", async () => {
      const pgUserRepo = userDataSource.getRepository(PgUser);
      await pgUserRepo.save({ email: "existing_email" });

      const account = await sut.load({ email: "existing_email" });

      expect(account).toEqual({ id: "1" });
    });

    it("should return an account if email exists", async () => {
      const account = await sut.load({ email: "new_email" });

      expect(account).toBeUndefined();
    });
  });
});
