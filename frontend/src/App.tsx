import React, { useMemo, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  useNavigate 
} from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Todos from './pages/Todos';
import Navbar from './components/Navbar';
import { authStore } from './stores/AuthStore';
import { themeStore } from './stores/ThemeStore';
import TodosPage from './pages/Todos';
import TodoDetail from './components/TodoDetail';
import AuthGuard from './components/AuthGuard';

const { Content } = Layout;
const { darkAlgorithm, defaultAlgorithm } = theme;

const AppContent: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login');
    };

    // Add event listener for unauthorized access
    window.addEventListener('unauthorized', handleUnauthorized);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  const themeConfig = useMemo(() => ({
    algorithm: themeStore.isDarkMode ? darkAlgorithm : defaultAlgorithm,
    components: {
      Layout: {
        bodyBg: themeStore.isDarkMode ? '#141414' : '#ffffff',
        headerBg: themeStore.isDarkMode ? '#001529' : '#f7f7f7',
      },
      Menu: {
        darkItemBg: themeStore.isDarkMode ? '#001529' : undefined,
        darkItemHoverBg: themeStore.isDarkMode ? '#1890ff' : undefined,
      }
    }
  }), [themeStore.isDarkMode]);

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ 
        minHeight: '100vh', 
        height: '100vh', 
        overflow: 'hidden' 
      }}>
        <Navbar />
        <Content style={{ 
          padding: '24px 24px 24px', 
          height: 'calc(100vh - 64px)', 
          overflow: 'auto' 
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<AuthGuard />}>
              <Route path="/todos" element={<TodosPage />}>
                <Route path=":todoId" element={<TodoDetail />} />
              </Route>
            </Route>
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
});

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;