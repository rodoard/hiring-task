import React, { useState, useEffect } from "react";
import { Card, Button, Modal, message, Form, Input, DatePicker, Switch, Typography, Tag, Tag as AntdTag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Todo } from "../models/todo";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { todoStore } from "../stores/TodoStore";
import { observer } from "mobx-react-lite";
import { themeStore } from '../stores/ThemeStore';
import TodoNotFound from './TodoNotFound';

dayjs.extend(isSameOrBefore);

const TodoDetail = observer(() => {
  const { todoId } = useParams<{ todoId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      // Reset states when todoId changes
      setTodo(null);
      setIsLoading(true);
      setNotFound(false);

      if (todoId) {
        try {
          const fetchedTodo = await todoStore.fetchTodoById(todoId);
          setTodo(fetchedTodo);
        } catch (error) {
          console.error('Failed to fetch todo:', error);
          setNotFound(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTodo();
  }, [todoId, navigate]);

  if (isLoading) return null;
  if (notFound) return <TodoNotFound />;
  if (!todo) return <TodoNotFound />;

  const formatDate = (dueDate: Date | string | undefined) => {
    if (!dueDate) return "";
    
    // Convert to Date object if it's a string
    const dateObj = dueDate instanceof Date 
      ? dueDate 
      : new Date(dueDate);
    
    // Use Intl.DateTimeFormat for localized formatting
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
    
    return formatter.format(dateObj);
  };

  const handleEdit = () => {
    // Reset previous status
    setSubmitStatus(null);
    
    // Populate form with existing todo data
    form.setFieldsValue({
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
      dueDate: todo.dueDate ? dayjs(todo.dueDate) : null
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    // Set submitting state
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validate form
      const values = await form.validateFields();
      
      // Prepare updated todo data
      const updatedTodo: Partial<Todo> = {
        title: values.title,
        description: values.description,
        isCompleted: values.isCompleted,
        dueDate: values.dueDate ? values.dueDate.toDate() : undefined
      };

      // Attempt to update todo and wait for server response
      const updatedTodoFromServer = await todoStore.updateTodo(todo.uuid, updatedTodo);

      // Update local todo state with server response
      setTodo(updatedTodoFromServer);

      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);

      setTimeout(() => {
         // Set success status
      setSubmitStatus({
        type: 'success',
        message: 'Todo updated successfully!'
      });
      }, 2500);     

      // Close modal after a short delay
      setTimeout(() => {
        setIsEditModalVisible(false);
        setSubmitStatus(null);
      }, 4800);
      
    } catch (error: any) {
      // Handle error in the modal
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to update todo'
      });
      
      console.error('Update todo error:', error);
      
      // Ensure submitting state is reset on error
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this todo?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      async onOk() {
        try {
          await todoStore.deleteTodo(todo.uuid);
          message.success('Todo deleted successfully');
          navigate('/todos');
        } catch (error) {
          message.error('Failed to delete todo');
        }
      },
    });
  };

  const todoDetailStyle: React.CSSProperties = {
    backgroundColor: themeStore.isDarkMode ? '#1f1f1f' : '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: themeStore.isDarkMode 
      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    height: '600px',
    margin: '0 auto',
    position: 'relative',
    overflowY: 'auto'
  };

  const todoHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${themeStore.isDarkMode ? '#333' : '#e0e0e0'}`,
    paddingBottom: '16px',
    marginBottom: '16px'
  };

  const todoTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: themeStore.isDarkMode ? '#ffffff' : '#000000',
    margin: 0
  };

  const todoMetaStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    color: themeStore.isDarkMode ? '#a0a0a0' : '#666666',
    padding: '12px',
    backgroundColor: themeStore.isDarkMode ? '#2a2a2a' : '#f5f5f5',
    borderRadius: '8px'
  };

  const metaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const todoDescriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: themeStore.isDarkMode ? '#d0d0d0' : '#333333',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: themeStore.isDarkMode ? '#2a2a2a' : '#f9f9f9',
    borderRadius: '8px',
    height: '200px',
    overflowY: 'auto'
  };

  const actionButtonStyle: React.CSSProperties = {
    marginRight: '12px'
  };

  return (
    <div style={todoDetailStyle}>
      <div style={todoHeaderStyle}>
        <Typography.Title level={2} style={todoTitleStyle}>
          {todo.title}
        </Typography.Title>
        <div>
          <Button 
            icon={<EditOutlined />} 
            onClick={handleEdit} 
            style={actionButtonStyle}
          >
            Edit
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => Modal.confirm({
              title: 'Are you sure you want to delete this todo?',
              content: 'This action cannot be undone.',
              onOk: handleDelete
            })}
          >
            Delete
          </Button>
        </div>
      </div>

      <div style={todoMetaStyle}>
        <div style={metaItemStyle}>
          <strong>Status:</strong>
          <AntdTag color={todo.isCompleted ? 'success' : 'processing'}>
            {todo.isCompleted ? 'Completed' : 'In Progress'}
          </AntdTag>
        </div>
        {todo.dueDate && (
          <div style={metaItemStyle}>
            <strong>Due Date:</strong>
            {formatDate(todo.dueDate)}
          </div>
        )}
      </div>

      {todo.description && (
        <div style={todoDescriptionStyle}>
          <Typography.Text>
            {todo.description}
          </Typography.Text>
        </div>
      )}

      <Modal
        title="Edit Todo"
        visible={isEditModalVisible}
        footer={null} // Remove default footer to customize
        onCancel={() => {
          setIsEditModalVisible(false);
          setSubmitStatus(null);
        }}
      >
        <Form form={form} layout="vertical" initialValues={{
          title: todo.title,
          description: todo.description,
          isCompleted: todo.isCompleted,
          dueDate: todo.dueDate ? dayjs(todo.dueDate) : null
        }}>
          <Form.Item 
            name="title" 
            label="Title" 
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Description"
            rules={[{ 
              max: 500, 
              message: 'Description cannot be longer than 500 characters' 
            }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter todo description (optional)" 
            />
          </Form.Item>
          
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="isCompleted" label="Completed" valuePropName="checked">
            <Switch />
          </Form.Item>

          {/* Custom footer with submit buttons and status */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '16px'
          }}>
            <Button 
              onClick={() => {
                setIsEditModalVisible(false);
                setSubmitStatus(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleSaveEdit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save
            </Button>
          </div>

          {submitStatus && (
            <div style={{
              marginTop: '16px',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: submitStatus.type === 'success' 
                ? 'rgba(0, 255, 0, 0.1)' 
                : 'rgba(255, 0, 0, 0.1)',
              border: `1px solid ${submitStatus.type === 'success' ? 'green' : 'red'}`,
              color: submitStatus.type === 'success' ? 'green' : 'red',
              textAlign: 'center'
            }}>
              {submitStatus.message}
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
});

export default TodoDetail;