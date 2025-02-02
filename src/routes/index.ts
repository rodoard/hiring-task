import { Router } from "express";
import {authRouter} from "./authRouter";
import todoRouter from "./todoRouter";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/todos", todoRouter);

export default appRouter;
