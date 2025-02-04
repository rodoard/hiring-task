import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../../services/todo.service';
import { getUserUuid } from '../../utils/request-user';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUuid = getUserUuid(req);
    
    if (!userUuid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const todoService = new TodoService(userUuid);

    const todos = await todoService.getTodos();

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};
