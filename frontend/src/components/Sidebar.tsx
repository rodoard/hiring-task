import React, { useState, CSSProperties } from "react";
import { Input, Select, List, Button, Typography, Modal, Form, DatePicker, message } from "antd";
import {  CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Todo } from "../models/todo";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { themeStore } from "../stores/ThemeStore";
import { todoStore } from "../stores/TodoStore";
import { authStore } from "../stores/AuthStore";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { Text } = Typography;

const Sidebar = observer(({ todos, onSelectTodo, onSort, onFilter }: { 
  todos: Todo[], 
  onSelectTodo: (todo: Todo | null) => void, 
  onSort: (sortBy: string) => void, 
  onFilter: (filterText: string, filterBy: string) => void 
}) => {
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [completedFilter, setCompletedFilter] = useState<string | null>(null);
  const [isAddTodoModalVisible, setIsAddTodoModalVisible] = useState(false);
  const [newTodoForm] = Form.useForm();
  const navigate = useNavigate();

  // Theme-aware styles
  const isDarkMode = themeStore.isDarkMode;
  const sectionStyle: React.CSSProperties = {
    width: "100%", 
    marginBottom: "16px", 
    padding: "12px", 
    border: `1px solid ${isDarkMode ? '#424242' : '#e0e0e0'}`, 
    borderRadius: "4px",
    backgroundColor: isDarkMode ? '#1f1f1f' : '#f9f9f9',
    boxShadow: isDarkMode ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold", 
    marginBottom: "8px", 
    display: "block",
    color: isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)'
  };

  const todoListStyle: React.CSSProperties = {
    width: "100%", 
    maxHeight: "400px", 
    overflowY: "auto",
    backgroundColor: isDarkMode ? '#141414' : 'white',
    borderRadius: "4px",
    border: `1px solid ${isDarkMode ? '#424242' : '#e0e0e0'}`,
    padding: "8px"
  };

  const todoItemStyle = (todo: Todo): React.CSSProperties => ({
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    padding: "8px",
    borderBottom: `1px solid ${isDarkMode ? '#333' : '#f0f0f0'}`,
    backgroundColor: isDarkMode 
      ? (todo.isCompleted ? '#2a2a2a' : '#1f1f1f') 
      : (todo.isCompleted ? '#f0f0f0' : 'white'),
    color: isDarkMode 
      ? (todo.isCompleted ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.85)') 
      : (todo.isCompleted ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.85)'),
    cursor: "pointer",
    transition: "background-color 0.2s"
  });

  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSortChange = (value: string) => {
    // If selecting the same sort field, toggle the order
    if (value === sortBy) {
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newSortOrder);
      onSort(`${value}:${newSortOrder}`);
    } else {
      // If selecting a new sort field, default to ascending
      setSortBy(value);
      setSortOrder('asc');
      onSort(`${value}:asc`);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    // Reset filter text when changing filter type
    setFilterText("");
    onFilter("", value);
  };

  const handleCompletedFilterChange = (value: string) => {
    const newCompletedFilter = value === completedFilter ? null : value;
    setCompletedFilter(newCompletedFilter);
    
    // If a completed filter is selected, apply it
    if (newCompletedFilter) {
      onFilter(newCompletedFilter, 'isCompleted');
    } else {
      // If no filter is selected, reset
      onFilter("", filterBy);
    }
  };

  const handleTextFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilterText = e.target.value;
    setFilterText(newFilterText);
    
    // Apply filter for title or description
    if (filterBy !== 'isCompleted') {
      // If text is empty, pass empty string to reset filter
      onFilter(newFilterText, filterBy);
    }
  };

  const handleTodoClick = (todo: Todo) => {
    onSelectTodo(todo);
    navigate(`/todos/${todo.uuid}`);
  };

  const handleAddTodoClick = () => {
    setIsAddTodoModalVisible(true);
  };

  const handleAddTodoSubmit = async () => {
    try {
      const values = await newTodoForm.validateFields();
      const newTodo = await todoStore.createTodo({
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate.toDate() : undefined,
        isCompleted: false
      });
      
      // Close modal and reset form
      setIsAddTodoModalVisible(false);
      newTodoForm.resetFields();
    } catch (error) {
      message.error(`Failed to create todo. ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Todo creation error:', error);
    }
  };

  return (
    <div style={{ 
      width: 300, 
      padding: "16px", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      backgroundColor: isDarkMode ? '#141414' : '#f5f5f5',
      color: isDarkMode ? 'white' : 'black',
      height: '100%',
      overflowY: 'auto'
    }}>
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "16px",
        color: isDarkMode ? 'rgba(255,255,255,0.85)' : '#333',
        fontWeight: 600
      }}>
        Todos
      </h2>
      
      {/* Add Todo Button */}
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={handleAddTodoClick} 
        style={{ 
          width: '100%', 
          marginBottom: '16px',
          backgroundColor: isDarkMode ? '#177ddc' : '#1890ff',
          borderColor: isDarkMode ? '#177ddc' : '#1890ff'
        }}
      >
        Add Todo
      </Button>
      
      {/* Filter Section */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Filter</span>
        
        <Select
          style={{ width: "100%", marginBottom: "12px" }}
          value={filterBy}
          onChange={handleFilterChange}
          placeholder="Filter by"
          popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
          dropdownStyle={{ 
            backgroundColor: isDarkMode ? '#262626' : 'white',
            color: isDarkMode ? 'white' : 'black'
          }}
        >
          <Option value="title">Title</Option>
          <Option value="description">Description</Option>
        </Select>

        {filterBy !== 'isCompleted' && (
          <Input
            placeholder={`Filter todos by ${filterBy}`}
            value={filterText}
            onChange={handleTextFilterChange}
            style={{ 
              marginBottom: "12px", 
              width: "100%",
              backgroundColor: isDarkMode ? '#262626' : 'white',
              color: isDarkMode ? 'white' : 'black',
              borderColor: isDarkMode ? '#424242' : '#d9d9d9'
            }}
          />
        )}

        <div style={{ 
          width: "100%", 
          display: "flex", 
          justifyContent: "space-between" 
        }}>
          <Button 
            type={completedFilter === 'true' ? 'primary' : 'default'}
            onClick={() => handleCompletedFilterChange('true')}
            style={{ 
              width: "48%",
              backgroundColor: completedFilter === 'true' 
                ? (isDarkMode ? '#177ddc' : '#1890ff') 
                : (isDarkMode ? '#262626' : 'white'),
              color: completedFilter === 'true' 
                ? 'white' 
                : (isDarkMode ? 'white' : 'black')
            }}
          >
            Completed
          </Button>
          <Button 
            type={completedFilter === 'false' ? 'primary' : 'default'}
            onClick={() => handleCompletedFilterChange('false')}
            style={{ 
              width: "48%",
              backgroundColor: completedFilter === 'false' 
                ? (isDarkMode ? '#177ddc' : '#1890ff') 
                : (isDarkMode ? '#262626' : 'white'),
              color: completedFilter === 'false' 
                ? 'white' 
                : (isDarkMode ? 'white' : 'black')
            }}
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Sort Section */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Sort</span>
        <Select 
          style={{ width: "100%" }}
          onChange={handleSortChange}
          value={sortBy}
          placeholder="Sort by"
          popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
          dropdownStyle={{ 
            backgroundColor: isDarkMode ? '#262626' : 'white',
            color: isDarkMode ? 'white' : 'black'
          }}
        >
          <Option value="title">Title</Option>
          <Option value="dueDate">Due Date</Option>
          <Option value="isCompleted">Completed Status</Option>
        </Select>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '8px' 
        }}>
          <Button 
            type={sortOrder === 'asc' ? 'primary' : 'default'}
            style={{ width: '48%' }}
            onClick={() => {
              setSortOrder('asc');
              onSort(`${sortBy}:asc`);
            }}
          >
            ASC
          </Button>
          <Button 
            type={sortOrder === 'desc' ? 'primary' : 'default'}
            style={{ width: '48%' }}
            onClick={() => {
              setSortOrder('desc');
              onSort(`${sortBy}:desc`);
            }}
          >
            DESC
          </Button>
        </div>
      </div>

      {/* Todo List */}
      <div style={todoListStyle}>
        <List
          dataSource={todos}
          renderItem={(todo) => (
            <List.Item 
              key={todo.uuid}
              style={todoItemStyle(todo)}
              onClick={() => handleTodoClick(todo)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {todo.isCompleted ? (
                  <CheckCircleOutlined 
                    style={{ 
                      color: isDarkMode ? '#52c41a' : '#52c41a', 
                      marginRight: '8px' 
                    }} 
                  />
                ) : (
                  <ClockCircleOutlined 
                    style={{ 
                      color: isDarkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', 
                      marginRight: '8px' 
                    }} 
                  />
                )}
                <Text 
                  style={{ 
                    color: isDarkMode 
                      ? (todo.isCompleted ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.85)') 
                      : (todo.isCompleted ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.85)'),
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {todo.title}
                </Text>
              </div>
              <Text 
                style={{ 
                  color: isDarkMode 
                    ? (todo.isCompleted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)') 
                    : (todo.isCompleted ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.45)'),
                  fontSize: '12px'
                }}
              >
                {todo.dueDate ? dayjs(todo.dueDate).format('MMM D') : 'No due date'}
              </Text>
            </List.Item>
          )}
        />
      </div>

      {/* Add Todo Modal */}
      <Modal
        title="Create New Todo"
        open={isAddTodoModalVisible}
        onOk={handleAddTodoSubmit}
        onCancel={() => setIsAddTodoModalVisible(false)}
        okText="Create"
      >
        <Form form={newTodoForm} layout="vertical">
          <Form.Item 
            name="title" 
            label="Title" 
            rules={[{ required: true, message: 'Please input the todo title!' }]}
          >
            <Input placeholder="Enter todo title" />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description"
          >
            <Input.TextArea placeholder="Enter todo description (optional)" />
          </Form.Item>
          <Form.Item 
            name="dueDate" 
            label="Due Date"
            rules={[
              {
                validator: (_, value: dayjs.Dayjs | null) => {
                  if (value) {
                    const selectedDate = value;
                    const today = dayjs().startOf('day');
                    
                    if (selectedDate.isSameOrBefore(today)) {
                      return Promise.reject(new Error('Due date must be in the future'));
                    }
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
              placeholder="Select due date" 
              popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
              disabledDate={(current) => {
                return current && current.isSameOrBefore(dayjs().startOf('day'));
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default Sidebar;