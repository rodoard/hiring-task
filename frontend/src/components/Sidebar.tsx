import React, { useState } from "react";
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
  const sectionStyle = {
    width: "100%", 
    marginBottom: "16px", 
    padding: "12px", 
    border: `1px solid ${isDarkMode ? '#424242' : '#f0f0f0'}`, 
    borderRadius: "4px",
    backgroundColor: isDarkMode ? '#1f1f1f' : 'white'
  };

  const labelStyle = {
    fontWeight: "bold", 
    marginBottom: "8px", 
    display: "block",
    color: isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)'
  };

  const handleSortChange = (value: string) => {
    onSort(value);
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
      backgroundColor: isDarkMode ? '#141414' : 'white',
      color: isDarkMode ? 'white' : 'black'
    }}>
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "16px",
        color: isDarkMode ? 'rgba(255,255,255,0.85)' : 'black'
      }}>
        Todos
      </h2>
      
      {/* Filter Section */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Filter</span>
        
        <Select
          style={{ width: "100%", marginBottom: "12px" }}
          value={filterBy}
          onChange={handleFilterChange}
          placeholder="Filter by"
          popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
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
              color: isDarkMode ? 'white' : 'black'
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
            style={{ width: "48%" }}
          >
            Completed
          </Button>
          <Button 
            type={completedFilter === 'false' ? 'primary' : 'default'}
            onClick={() => handleCompletedFilterChange('false')}
            style={{ width: "48%" }}
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Sort Section */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Sort</span>
        <Select
          defaultValue="title"
          style={{ width: "100%" }}
          onChange={handleSortChange}
          placeholder="Sort by"
          popupClassName={isDarkMode ? 'dark-select-dropdown' : ''}
        >
          <Option value="title">Title</Option>
          <Option value="dueDate">Due Date</Option>
          <Option value="isCompleted">Completed</Option>
        </Select>
      </div>

      {/* Add Todo Button */}
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        style={{ 
          width: "300px", 
          marginBottom: "16px",
          padding: "12px",
          border: `1px solid ${isDarkMode ? '#424242' : '#f0f0f0'}`, 
          borderRadius: "4px",
          backgroundColor: isDarkMode ? '#1f1f1f' : 'white'
        }}
        onClick={handleAddTodoClick}
      >
        Add Todo
      </Button>

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

      <List
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item 
            key={todo.uuid} 
            onClick={() => handleTodoClick(todo)}
            style={{ 
              cursor: "pointer", 
              width: "100%", 
              textAlign: "center",
              backgroundColor: isDarkMode ? 
                (todo.isCompleted ? '#1f1f1f' : '#262626') : 
                (todo.isCompleted ? '#f0f0f0' : 'white'),
              color: isDarkMode ? 
                (todo.isCompleted ? 'rgba(255,255,255,0.45)' : 'white') : 
                (todo.isCompleted ? 'rgba(0,0,0,0.45)' : 'black'),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px'
            }}
          >
            <div style={{
              display: 'flex', 
              width: '100%', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <span>{todo.title}</span>
              {todo.isCompleted ? (
                <CheckCircleOutlined 
                  style={{ 
                    color: isDarkMode ? '#52c41a' : '#52c41a',
                    fontSize: '16px' 
                  }} 
                />
              ) : (
                <ClockCircleOutlined 
                  style={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                    fontSize: '16px' 
                  }} 
                />
              )}
            </div>
            {todo.dueDate && (
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: '0.75em', 
                  fontStyle: 'italic', 
                  alignSelf: 'flex-end',
                  marginTop: '4px',
                  color: isDarkMode ? 
                    (todo.isCompleted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.45)') : 
                    (todo.isCompleted ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.45)')
                }}
              >
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </Text>
            )}
          </List.Item>
        )}
        style={{ 
          width: "100%", 
          maxHeight: "400px", 
          overflowY: "auto",
          backgroundColor: isDarkMode ? '#141414' : 'white'
        }}
      />
    </div>
  );
});

export default Sidebar;