import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { todoStore } from '../stores/TodoStore';
import TodosPage from './Todos';
import { Todo } from '../models/todo';
import { filterTodos } from '../utils/todoFilter';
import { sortTodos } from '../utils/todoSort';

// Mock the TodoStore
jest.mock('../stores/TodoStore', () => ({
  todoStore: {
    todos: [],
    fetchTodos: jest.fn(),
    fetchTodoById: jest.fn(),
  }
}));

// Mock react-router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({}),
  useNavigate: () => jest.fn(),
}));

describe('TodosPage', () => {
  const mockTodos: Todo[] = [
    { 
      uuid: '1', 
      title: 'C Todo', 
      description: 'Description 1', 
      isCompleted: false,
      dueDate: new Date('2023-03-15'),
    },
    { 
      uuid: '2', 
      title: 'A Todo', 
      description: 'Description 2', 
      isCompleted: true,
      dueDate: new Date('2023-01-20'),
    },
    { 
      uuid: '3', 
      title: 'B Todo', 
      description: 'Description 3', 
      isCompleted: false,
      dueDate: new Date('2023-02-10'),
    }
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock todos
    todoStore.todos = mockTodos;
  });

  it('renders todos from store', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<TodosPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify fetchTodos was called
    expect(todoStore.fetchTodos).toHaveBeenCalled();
  });

  it('should filter todos when filter input is used', async () => {
    // Verify filter logic
    const filteredTodos = filterTodos(mockTodos, 'C Todo', 'title');
    expect(filteredTodos.length).toBe(1);
    expect(filteredTodos[0].title).toBe('C Todo');
  });

  it('should sort todos by title', async () => {
    // Simulate sorting by title
    const sortedTodosByTitle = sortTodos(mockTodos, 'title', 'asc');
    
    // Verify sorting order
    expect(sortedTodosByTitle[0].title).toBe('A Todo');
    expect(sortedTodosByTitle[1].title).toBe('B Todo');
    expect(sortedTodosByTitle[2].title).toBe('C Todo');

    // Verify descending sort
    const sortedTodosByTitleDesc = sortTodos(mockTodos, 'title', 'desc');
    expect(sortedTodosByTitleDesc[0].title).toBe('C Todo');
    expect(sortedTodosByTitleDesc[1].title).toBe('B Todo');
    expect(sortedTodosByTitleDesc[2].title).toBe('A Todo');
  });

  it('should sort todos by due date', async () => {
    // Simulate sorting by due date
    const sortedTodosByDueDate = sortTodos(mockTodos, 'dueDate', 'asc');
    
    // Verify sorting order, handling optional dates
    const validDueDates = sortedTodosByDueDate.filter(todo => todo.dueDate !== undefined);
    for (let i = 0; i < validDueDates.length - 1; i++) {
      expect(validDueDates[i].dueDate!.getTime()).toBeLessThanOrEqual(validDueDates[i + 1].dueDate!.getTime());
    }

    // Verify descending sort
    const sortedTodosByDueDateDesc = sortTodos(mockTodos, 'dueDate', 'desc');
    const validDescDueDates = sortedTodosByDueDateDesc.filter(todo => todo.dueDate !== undefined);
    for (let i = 0; i < validDescDueDates.length - 1; i++) {
      expect(validDescDueDates[i].dueDate!.getTime()).toBeGreaterThanOrEqual(validDescDueDates[i + 1].dueDate!.getTime());
    }
  });

  it('should sort todos by completion status', async () => {
    // Simulate sorting by completion status
    const sortedTodosByCompletion = sortTodos(mockTodos, 'isCompleted', 'asc');
    
    // Verify sorting order (incomplete todos first)
    expect(sortedTodosByCompletion[0].isCompleted).toBe(false);
    expect(sortedTodosByCompletion[1].isCompleted).toBe(false);
    expect(sortedTodosByCompletion[2].isCompleted).toBe(true);

    // Verify descending sort (completed todos first)
    const sortedTodosByCompletionDesc = sortTodos(mockTodos, 'isCompleted', 'desc');
    expect(sortedTodosByCompletionDesc[0].isCompleted).toBe(true);
    expect(sortedTodosByCompletionDesc[1].isCompleted).toBe(false);
    expect(sortedTodosByCompletionDesc[2].isCompleted).toBe(false);
  });
});
