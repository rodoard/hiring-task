import { filterTodos } from './todoFilter';
import { Todo } from '../models/todo';

describe('filterTodos', () => {
  const mockTodos: Todo[] = [
    { 
      uuid: '1', 
      title: 'B Todo', 
      description: 'Description 1', 
      isCompleted: false,
      dueDate: new Date('2023-01-15')
    },
    { 
      uuid: '2', 
      title: 'A Todo', 
      description: 'Description 2', 
      isCompleted: true,
      dueDate: new Date('2023-02-20')
    },
    { 
      uuid: '3', 
      title: 'C Todo', 
      description: 'Description 3', 
      isCompleted: false,
      dueDate: new Date('2023-01-10')
    }
  ];

  it('should filter todos by title', () => {
    const filteredTodos = filterTodos(mockTodos, 'B', 'title');
    expect(filteredTodos.length).toBe(1);
    expect(filteredTodos[0].title).toBe('B Todo');
  });

  it('should filter todos by description', () => {
    const filteredTodos = filterTodos(mockTodos, 'Description 1', 'description');
    expect(filteredTodos.length).toBe(1);
    expect(filteredTodos[0].title).toBe('B Todo');
  });

  it('should filter todos by completion status', () => {
    const completedTodos = filterTodos(mockTodos, 'true', 'isCompleted');
    expect(completedTodos.length).toBe(1);
    expect(completedTodos[0].title).toBe('A Todo');

    const incompleteTodos = filterTodos(mockTodos, 'false', 'isCompleted');
    expect(incompleteTodos.length).toBe(2);
  });

  it('should return empty array if no matches found', () => {
    const filteredTodos = filterTodos(mockTodos, 'Nonexistent', 'title');
    expect(filteredTodos.length).toBe(0);
  });

  it('should be case-insensitive', () => {
    const filteredTodos = filterTodos(mockTodos, 'b', 'title');
    expect(filteredTodos.length).toBe(1);
  });

  it('should return all todos if filter text is empty', () => {
    const filteredTodos = filterTodos(mockTodos, '', 'title');
    expect(filteredTodos.length).toBe(3);
  });
});
