import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { UserEntity, TodoEntity } from "../entities";
import { Env } from "../env";

export const AppDataSource = new DataSource({
  type: Env.dbType as any,
  database: Env.dbName,
  host: Env.host,
  username: Env.username,
  password: Env.password,
  port: Env.dbPort,
  logging: false,
  synchronize: false,
  entities: [UserEntity, TodoEntity],
  entitySkipConstructor: true,
  ...(Env.dbType !== 'sqlite' ? { namingStrategy: new SnakeNamingStrategy() } : {}),
});
