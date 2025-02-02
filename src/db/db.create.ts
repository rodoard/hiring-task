import { createDatabase } from "typeorm-extension";
import { Env } from "../env";
import { UserEntity, TodoEntity } from "../entities";

export const dbCreate = async () => {
  await createDatabase({
    ifNotExist: true,
    options: {
      type: Env.dbType as any,
      host: Env.host,
      username: Env.username,
      password: Env.password,
      port: Env.dbPort,
      database: Env.dbName,
      entities: [UserEntity, TodoEntity],
    },
  });
};
