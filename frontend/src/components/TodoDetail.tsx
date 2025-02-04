import React, { useState } from "react";
import { Card, Button, Modal, message, Form, Input, DatePicker, Switch } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Todo } from "../models/todo";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

// Sample todo data for demonstration
const SAMPLE_TODOS: Todo[] = [
  {
    uuid: "todo-1",
    title: "Learn React",
    description: "Complete React tutorial",
    isCompleted: false,
    dueDate: new Date("2024-03-15")
  },
  {
    uuid: "todo-2",
    title: "Build TodoApp",
    description: "Create a full-featured todo application",
    isCompleted: true,
    dueDate: new Date("2024-02-01")
  }
];

const TodoDetail = () => {
  const { todoId } = useParams<{ todoId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // Find todo by ID from sample data
  const todo = SAMPLE_TODOS.find(t => t.uuid === todoId) || null;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  if (!todo) return <div>Todo not found</div>;

  const formatDate = (dueDate: Date | string | undefined) => {
    if (!dueDate) return "";
    return dueDate instanceof Date ? dayjs(dueDate).format('YYYY-MM-DD') : dueDate;
  };

  const handleEdit = () => {
    // Populate form with existing todo data
    form.setFieldsValue({
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
      dueDate: todo.dueDate ? dayjs(todo.dueDate) : null
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    form.validateFields()
      .then(values => {
        // In a real app, this would update the todo via API
        const updatedTodo: Todo = {
          ...todo,
          title: values.title,
          description: values.description,
          isCompleted: values.isCompleted,
          dueDate: values.dueDate ? values.dueDate.toDate() : undefined
        };

        // Update sample todos (in a real app, this would be an API call)
        const todoIndex = SAMPLE_TODOS.findIndex(t => t.uuid === todo.uuid);
        if (todoIndex !== -1) {
          SAMPLE_TODOS[todoIndex] = updatedTodo;
        }

        message.success('Todo updated successfully');
        setIsEditModalVisible(false);
      })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this todo?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk() {
        // In a real app, this would call a delete API
        const todoIndex = SAMPLE_TODOS.findIndex(t => t.uuid === todo.uuid);
        if (todoIndex !== -1) {
          SAMPLE_TODOS.splice(todoIndex, 1);
        }
        message.success('Todo deleted successfully');
        navigate('/todos');
      },
    });
  };

  return (
    <>
      <Card 
        title={todo.title} 
        style={{ marginLeft: "16px", flex: 1 }}
        extra={
          <div>
            <Button 
              icon={<EditOutlined />} 
              onClick={handleEdit} 
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>Due Date: {formatDate(todo.dueDate)}</p>
        <p>Completed: {todo.isCompleted ? "Yes" : "No"}</p>
        <p>Description: {todo.description}</p>
      </Card>

      <Modal
        title="Edit Todo"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_todo_form"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the todo title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="isCompleted"
            label="Completed"
            valuePropName="checked"
          >
            <Switch />
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
              // Disable dates before today
              disabledDate={(current) => {
                return current && current.isSameOrBefore(dayjs().startOf('day'));
              }}
              // Convert between native Date and DatePicker
              value={form.getFieldValue('dueDate') ? form.getFieldValue('dueDate') : null}
              onChange={(date) => {
                form.setFieldsValue({ 
                  dueDate: date 
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TodoDetail;