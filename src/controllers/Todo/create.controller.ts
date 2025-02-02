import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../../services/todo.service';
import { TodoEntity } from '../../entities';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUuid = req.user.uuid;
    const todoService = new TodoService(userUuid);

    const todoData: Partial<TodoEntity> = {
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted || false
    };

    const todo = await todoService.addTodo(todoData);

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};
