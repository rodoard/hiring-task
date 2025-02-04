import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Sidebar from "../components/Sidebar";
import { Todo } from "../models/todo";
import { todoStore } from "../stores/TodoStore";
import { filterTodos } from "../utils/todoFilter";
import { sortTodos, SortOrder } from "../utils/todoSort";

const { Content, Sider } = Layout;

const TodosPage = observer(() => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [originalTodos, setOriginalTodos] = useState<Todo[]>([]);
  const { todoId } = useParams<{ todoId?: string }>();

  useEffect(() => {
    // Fetch all user todos when the page loads
    const fetchTodos = async () => {
      try {
        await todoStore.fetchTodos();
      } catch (error) {
        console.error('Failed to fetch todos', error);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    // Fetch specific todo if todoId is present
    const fetchSpecificTodo = async () => {
      if (todoId) {
        try {
          await todoStore.fetchTodoById(todoId);
        } catch (error) {
          console.error('Failed to fetch specific todo', error);
        }
      }
    };

    fetchSpecificTodo();
  }, [todoId]);

  useEffect(() => {
    // Update local state when TodoStore todos change
    setTodos(todoStore.todos);
    setOriginalTodos(todoStore.todos);
  }, [todoStore.todos]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300}>
        <Sidebar
          todos={todos}
          onSelectTodo={() => {}} // Placeholder to maintain prop interface
          onSort={(sortSpec: string) => {
            const [sortBy, sortOrder] = sortSpec.split(':');
            
            // Use the sortTodos utility
            const sortedTodos = sortTodos(todos, sortBy, sortOrder as SortOrder);
            setTodos(sortedTodos);
          }}
          onFilter={(filterText: string, filterBy: string) => {
            console.log('Filter called with:', { filterText, filterBy });
            // If no filter text, reset to original todos
            if (!filterText) {
              setTodos(originalTodos);
              return;
            }

            // Use the filterTodos utility
            const filteredTodos = filterTodos(originalTodos, filterText, filterBy);
            console.log('Filtered todos:', filteredTodos);
            setTodos(filteredTodos);
          }}
        />
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
});

export default TodosPage;