import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../../services/todo.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUuid = req.user.uuid;
    const todoService = new TodoService(userUuid);

    const todos = await todoService.getTodos();

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};
