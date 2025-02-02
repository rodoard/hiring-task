import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../../services/todo.service';

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUuid = req.user.uuid;
    const { uuid } = req.params;

    const todoService = new TodoService(userUuid);

    const deletedTodo = await todoService.deleteTodo({ uuid });

    res.status(200).json(deletedTodo);
  } catch (error) {
    next(error);
  }
};
