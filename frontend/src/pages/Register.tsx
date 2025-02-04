import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { authStore } from '../stores/AuthStore';
import { themeStore } from '../stores/ThemeStore';
import { observer } from 'mobx-react-lite';

const Register: React.FC = observer(() => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // Redirect authenticated users to home page
    if (authStore.isAuthenticated) {
      navigate('/');
    }
  }, [authStore.isAuthenticated, navigate]);

  const onFinish = async (values: { username: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      await register({
        username: values.username,
        email: values.email,
        password: values.password
      });
      
      message.success('Registration successful. Please log in.');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      message.error(errorMessage);
      console.error('Registration failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      marginTop: '64px',
      backgroundColor: themeStore.isDarkMode ? '#141414' : '#f0f2f5',
    }}>
      <Card 
        title="Create an Account" 
        style={{ 
          width: 300, 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: themeStore.isDarkMode ? '#1f1f1f' : '#ffffff',
          color: themeStore.isDarkMode ? '#ffffff' : '#000000'
        }}
      >
        <Form
          name="register"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="Username" 
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ 
              required: true, 
              message: 'Please input your Email!',
              type: 'email'
            }]}
          >
            <Input 
              prefix={<MailOutlined className="site-form-item-icon" />} 
              placeholder="Email" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={isLoading}
            >
              Register
            </Button>
            <div style={{ 
              marginTop: '10px', 
              textAlign: 'center',
              color: themeStore.isDarkMode ? '#ffffff' : '#000000'
            }}>
              Already have an account? <Link to="/login" style={{ color: themeStore.isDarkMode ? '#66ccff' : '#1890ff' }}>Login now!</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

export default Register;