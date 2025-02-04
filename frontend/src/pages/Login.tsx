import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';
import { themeStore } from '../stores/ThemeStore';
import { observer } from 'mobx-react-lite';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // Redirect authenticated users to home page
    if (authStore.isAuthenticated) {
      navigate('/');
    }
  }, [authStore.isAuthenticated, navigate]);

  const onFinish = async (values: LoginFormData) => {
    // Prevent multiple simultaneous login attempts
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      // Use AuthStore's login method directly
      await authStore.login({
        email: values.email, 
        password: values.password
      });

      // Determine where to navigate after successful login
      message.success('Login successful');
      navigate('/', { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      message.error(errorMessage);
      console.error('Login failed', error);
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
        title="Login to Your Account" 
        style={{ 
          width: 300, 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: themeStore.isDarkMode ? '#1f1f1f' : '#ffffff',
          color: themeStore.isDarkMode ? '#ffffff' : '#000000'
        }}
      >
        <Form
          name="loginForm"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
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
              className="login-form-button" 
              block
              loading={isLoading}
            >
              Login
            </Button>
            <div style={{ 
              marginTop: '10px', 
              textAlign: 'center',
              color: themeStore.isDarkMode ? '#ffffff' : '#000000'
            }}>
              Don't have an account? <Link to="/register" style={{ color: themeStore.isDarkMode ? '#66ccff' : '#1890ff' }}>Register now!</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

export default Login;