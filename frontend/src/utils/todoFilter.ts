import { Todo } from "../models/todo";

export const filterTodos = (
  todos: Todo[], 
  filterText: string, 
  filterBy: string = 'title'
): Todo[] => {
  // If no filter text, return all todos
  if (!filterText) {
    return todos;
  }

  // Normalize filter text
  const normalizedFilterText = filterText.toLowerCase().trim();

  // Filter todos based on the specified criteria
  return todos.filter((todo) => {
    switch (filterBy) {
      case 'title':
        return todo.title.toLowerCase().includes(normalizedFilterText);
      case 'description':
        return todo.description?.toLowerCase().includes(normalizedFilterText) || false;
      case 'isCompleted':
        return todo.isCompleted.toString().toLowerCase() === normalizedFilterText;
      default:
        return false;
    }
  });
};
