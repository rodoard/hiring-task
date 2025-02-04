import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../../services/todo.service';
import { TodoEntity } from '../../entities';
import { getUserUuid } from '../../utils/request-user';
import httpStatus from 'http-status';

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUuid = getUserUuid(req);
    
    if (!userUuid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { uuid } = req.params;

    const todoService = new TodoService(userUuid);

    const updateData: Partial<TodoEntity> = {
      uuid,
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined
    };

    const updatedTodo = await todoService.updateTodo(updateData);

    res.status(httpStatus.OK).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};
