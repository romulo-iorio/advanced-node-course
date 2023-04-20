import type { DataSource } from "typeorm";
import type { IMemoryDb } from "pg-mem";
import { newDb } from "pg-mem";

type FakeDbReturn = {
  dataSource: DataSource;
  db: IMemoryDb;
};

export const makeFakeDb = async (
  entities?: unknown[]
): Promise<FakeDbReturn> => {
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
