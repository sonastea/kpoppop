import { useAuth } from 'contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user || !user) navigate('/memes');
  }, [user]);

  return null;
};

export default Home;
