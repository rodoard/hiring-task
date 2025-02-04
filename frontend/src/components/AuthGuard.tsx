import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';

const AuthGuard = observer(() => {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
});

export default AuthGuard;
