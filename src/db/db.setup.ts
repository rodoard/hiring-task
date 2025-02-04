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
  synchronize: Env.nodeEnv === 'test', // Enable synchronize only for test env
  entities: [UserEntity, TodoEntity],
  entitySkipConstructor: true,
  ...(Env.dbType === 'sqlite' ? { 
    // Enable foreign key support for SQLite
    extra: { 
      // Enable foreign key constraints
      enableForeignKeys: true 
    }
  } : {}),
  ...(Env.dbType !== 'sqlite' ? { namingStrategy: new SnakeNamingStrategy() } : {}),
});
