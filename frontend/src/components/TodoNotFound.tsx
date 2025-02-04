import React from 'react';
import { Result } from 'antd';
import { themeStore } from '../stores/ThemeStore';
import { observer } from 'mobx-react-lite';

const TodoNotFound: React.FC = observer(() => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)', // Subtract navbar height
      backgroundColor: themeStore.isDarkMode ? '#141414' : '#f0f2f5',
      padding: '20px',
    }}>
      <Result
        status="404"
        title={
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 'bold',
            color: themeStore.isDarkMode ? '#ffffff' : '#000000'
          }}>
            Todo Not Found
          </div>
        }
        subTitle={
          <div style={{ 
            fontSize: '18px',
            color: themeStore.isDarkMode ? '#a0a0a0' : '#666666'
          }}>
            The todo you are looking for does not exist or has been deleted.
          </div>
        }
        style={{
          textAlign: 'center',
          backgroundColor: themeStore.isDarkMode ? '#1f1f1f' : '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  );
});

export default TodoNotFound;
