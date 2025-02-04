export interface Todo {
  uuid: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: Date; // Optional due date
}
