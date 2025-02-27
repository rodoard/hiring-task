import React from 'react';
import { Layout, Menu, Switch } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LoginOutlined, 
  UserAddOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons';
import { authStore } from '../stores/AuthStore';
import { themeStore } from '../stores/ThemeStore';
import { observer } from 'mobx-react-lite';

const { Header } = Layout;

const Navbar: React.FC = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleThemeToggle = () => {
    themeStore.toggleTheme();
  };

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      backgroundColor: themeStore.isDarkMode ? '#001529' : '#f5f5f5',
      boxShadow: themeStore.isDarkMode ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          fontSize: '18px', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          transition: 'color 0.3s'
        }}
      >
        <Link 
          to="/" 
          onClick={handleHomeClick}
          style={{ 
            color: 'inherit', 
            textDecoration: 'none',
            marginRight: '16px'
          }}
        >
          Hiring Task App
        </Link>
        <Switch
          size="small"
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={themeStore.isDarkMode}
          onChange={handleThemeToggle}
        />
      </div>
      <Menu 
        theme={themeStore.isDarkMode ? "dark" : "light"} 
        mode="horizontal" 
        selectedKeys={[location.pathname]}
        style={{ 
          flex: 1, 
          justifyContent: 'flex-end',
          backgroundColor: 'transparent'
        }}
      >
        {!authStore.isAuthenticated && (
          <>
            <Menu.Item 
              key="/login" 
              icon={<LoginOutlined />}
            >
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item 
              key="/register" 
              icon={<UserAddOutlined />}
            >
              <Link to="/register">Register</Link>
            </Menu.Item>
          </>
        )}
        {authStore.isAuthenticated && (
          <>
            <Menu.Item 
              key="/logout" 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
});

export default Navbar;
