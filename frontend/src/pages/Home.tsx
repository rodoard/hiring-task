import React from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import Authenticated from '../components/home/Authenticated';
import UnAuthenticated from '../components/home/UnAuthenticated';

const Home: React.FC = observer(() => {
  return authStore.isAuthenticated 
    ? <Authenticated /> 
    : <UnAuthenticated />;
});

export default Home;
