import { Todo } from "../models/todo";

export type SortOrder = 'asc' | 'desc';

export const sortTodos = (
  todos: Todo[], 
  sortBy: string, 
  sortOrder: SortOrder = 'asc'
): Todo[] => {
  return [...todos].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'dueDate':
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = dateA - dateB;
        break;
      case 'isCompleted':
        comparison = a.isCompleted === b.isCompleted ? 0 : (a.isCompleted ? 1 : -1);
        break;
      default:
        return 0;
    }
    
    // Reverse comparison if sort order is descending
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};
