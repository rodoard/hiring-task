import { Env } from "./env";
import app from "./app";
import { dbCreate, AppDataSource } from "./db";

export const main = async () => {  
  try {
    await dbCreate();
    await AppDataSource.initialize();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }

  const { port } = Env;
  app.listen(port, () => {
    console.log(`Server is listening on ${port}.`);
  });
};

// Only call main if not in test environment
if (process.env.NODE_ENV !== 'test') {
  main();
}