import { sortTodos } from './todoSort';
import { Todo } from '../models/todo';

describe('sortTodos', () => {
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

  it('should sort todos by title in ascending order', () => {
    const sortedTodos = sortTodos(mockTodos, 'title', 'asc');
    expect(sortedTodos[0].title).toBe('A Todo');
    expect(sortedTodos[1].title).toBe('B Todo');
    expect(sortedTodos[2].title).toBe('C Todo');
  });

  it('should sort todos by title in descending order', () => {
    const sortedTodos = sortTodos(mockTodos, 'title', 'desc');
    expect(sortedTodos[0].title).toBe('C Todo');
    expect(sortedTodos[1].title).toBe('B Todo');
    expect(sortedTodos[2].title).toBe('A Todo');
  });

  it('should sort todos by due date in ascending order', () => {
    const sortedTodos = sortTodos(mockTodos, 'dueDate', 'asc');
    const dateA = sortedTodos[0].dueDate ? sortedTodos[0].dueDate.getTime() : -Infinity;
    const dateB = sortedTodos[1].dueDate ? sortedTodos[1].dueDate.getTime() : -Infinity;
    const dateC = sortedTodos[2].dueDate ? sortedTodos[2].dueDate.getTime() : -Infinity;
    
    expect(dateA).toBeLessThan(dateB);
    expect(dateB).toBeLessThan(dateC);
  });

  it('should sort todos by completed status in ascending order', () => {
    const sortedTodos = sortTodos(mockTodos, 'isCompleted', 'asc');
    expect(sortedTodos[0].isCompleted).toBe(false);
    expect(sortedTodos[1].isCompleted).toBe(false);
    expect(sortedTodos[2].isCompleted).toBe(true);
  });
});
