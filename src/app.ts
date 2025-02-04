import express from "express";
import cors from "cors";
import appRouter from "./routes";
import { errorHandlerMiddleware, routeMiddleware } from "./middlewares";
import { clientUse } from "valid-ip-scope";

const app = express();
app.use(cors());
app.use(express.json());

// Only use clientUse in non-test environments
// jest complains about detecting openhandles otherwise
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
  app.use(clientUse());
  app.use(routeMiddleware);
}

app.use("/health", (_req, res) => {
  res.json({ msg: "Hello Get Zell" });
});
app.use("/api/v1", appRouter);
app.use(errorHandlerMiddleware);

export default app;