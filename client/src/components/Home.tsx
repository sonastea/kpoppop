import { useAuth } from 'contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  if (user || !user) window.location.href = '/memes';

  return <></>;
};
export default Home;
