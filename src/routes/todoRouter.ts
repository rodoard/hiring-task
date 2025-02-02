import { Router } from 'express';
import { TodoController as todoController } from '../controllers';
import { checkAuth } from '../utils/checkAuth';

const todoRouter = Router();

todoRouter.use(checkAuth);

todoRouter.post('/', todoController.create);
todoRouter.get('/', todoController.getAll);
todoRouter.get('/:uuid', todoController.get);
todoRouter.put('/:uuid', todoController.update);
todoRouter.delete('/:uuid', todoController.remove);

export default todoRouter;
