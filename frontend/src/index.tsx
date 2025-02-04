import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';

import 'antd/dist/reset.css';
import { getApiUrl } from './utils/apiUrl';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);