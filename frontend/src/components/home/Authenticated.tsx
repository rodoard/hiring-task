import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography } from 'antd';
import { 
  ToolOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AuthenticatedHome: React.FC = () => {
  const features = [
    {
      icon: <ToolOutlined />,
      title: 'Todo Management',
      description: 'Create, update, and track your todos efficiently.',
      link: '/todos',
      linkText: 'Go to Todos'
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px' 
    }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Welcome to Your Productivity Hub
      </Title>
      
      <Row gutter={[24, 24]} justify="center">
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              style={{ 
                textAlign: 'center', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'default'  
              }}
            >
              <div style={{ 
                fontSize: '48px', 
                color: '#1890ff', 
                marginBottom: '16px' 
              }}>
                {feature.icon}
              </div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
              <Link 
                to={feature.link} 
                style={{ 
                  marginTop: 'auto', 
                  display: 'block',
                  color: '#00ffff',  
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  fontSize: '18px',  
                  padding: '10px',
                  backgroundColor: 'rgba(0, 255, 255, 0.2)',  
                  borderRadius: '8px',
                  textAlign: 'center',
                  transition: 'background-color 0.3s ease',
                  cursor: 'pointer'  
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
                }}
              >
                {feature.linkText}
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AuthenticatedHome;
