import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { 
  LoginOutlined, 
  UserAddOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UnauthenticatedHome: React.FC = () => {
  const features = [
    {
      icon: <LoginOutlined />,
      title: 'Login',
      description: 'Access your account and manage your todos.',
      link: '/login',
      linkText: 'Login',
      buttonType: 'primary' as const
    },
    {
      icon: <UserAddOutlined />,
      title: 'Register',
      description: 'Create a new account to start tracking your tasks.',
      link: '/register',
      linkText: 'Register',
      buttonType: 'default' as const
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px', 
      textAlign: 'center' 
    }}>
      <Title level={1} style={{ marginBottom: '32px' }}>
        Welcome to Todo List Application
      </Title>
      
      <Paragraph style={{ 
        maxWidth: '600px', 
        margin: '0 auto 32px', 
        fontSize: '16px' 
      }}>
        Streamline your productivity with our intuitive todo management platform.<br/>
        Create, track, and complete tasks effortlessly.
      </Paragraph>
      
      <Row gutter={[24, 24]} justify="center">
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ 
                textAlign: 'center', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between' 
              }}
            >
              <div>
                <div style={{ 
                  fontSize: '48px', 
                  color: '#1890ff', 
                  marginBottom: '16px' 
                }}>
                  {feature.icon}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </div>
              <Link 
                to={feature.link} 
                style={{ 
                  marginTop: 'auto', 
                  display: 'block',
                  width: '100%' 
                }}
              >
                <Button 
                  type={feature.buttonType} 
                  icon={feature.icon} 
                  size="large"
                  block
                >
                  {feature.linkText}
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UnauthenticatedHome;
