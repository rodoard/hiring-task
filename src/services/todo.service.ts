import { TodoEntity, UserEntity } from "../entities";
import { AppDataSource } from "../db";
import { NotFoundError } from "../errors/notFound.error";
import { InvalidEntityError } from "../errors/invalidEntity.error";

export class TodoService {
  private userRepository = AppDataSource.getRepository(UserEntity);
  private todoRepository = AppDataSource.getRepository(TodoEntity);
  private userUuid: string;

  constructor(userUuid: string) {
    this.userUuid = userUuid;
  }

  async getTodo(uuid: string) {
    const todo = await this.todoRepository.findOne({
      where: { 
        uuid, 
        user: { uuid: this.userUuid } 
      }
    });

    return todo;
  }

  async addTodo(todoData: Partial<TodoEntity>) {
    const todo = this.todoRepository.create({
      ...todoData,
      user: { uuid: this.userUuid } as UserEntity
    });

    return await this.todoRepository.save(todo);
  }

  async getTodos() {
    const todos = await this.todoRepository.find({
      where: { user: { uuid: this.userUuid }  as UserEntity},
      order: { dueDate: 'ASC' }
    });

    return todos;
  }

  async updateTodo(todoData: Partial<TodoEntity>) {
    const { uuid, isCompleted, ...safeData } = todoData;

    if (!uuid) {
      throw new InvalidEntityError('Todo UUID is required for update');
    }

    const todo = await this.todoRepository.findOne({
      where: { 
        uuid, 
        user: { uuid: this.userUuid } 
      }
    });

    if (!todo) {
      throw new NotFoundError(`Todo with UUID ${uuid} not found for this user`);
    }

    if (isCompleted !== undefined) {
      todo.isCompleted = isCompleted;
    }

    this.todoRepository.merge(todo, safeData);
    return await this.todoRepository.save(todo);
  }

  async deleteTodo(uuid: string) {
    if (!uuid) {
      throw new InvalidEntityError('Todo UUID is required for deletion');
    }

    const todo = await this.todoRepository.findOne({
      where: { 
        uuid, 
        user: { uuid: this.userUuid } 
      }
    });

    if (!todo) {
      throw new NotFoundError(`Todo with UUID ${uuid} not found for this user`);
    }

    const deletedTodo = { 
      uuid: todo.uuid, 
      title: todo.title, 
      description: todo.description,
      isCompleted: todo.isCompleted
    };

    await this.todoRepository.remove(todo);
    return deletedTodo;
  }
}
