import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../../services/todo.service';
import { NotFoundError } from '../../errors/notFound.error';

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUuid = req.user.uuid;
    const { uuid } = req.params;

    const todoService = new TodoService(userUuid);

    const todo = await todoService.getTodo(uuid);

    if (!todo) {
      throw new NotFoundError('Todo not found');
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};
