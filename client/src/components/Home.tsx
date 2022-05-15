import { useAuth } from 'contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  //Redirect to login screen if user isn't logged in
  if (!user) window.location.href = '/login';

  //Logged in users go the memes page
  if (user) window.location.href = '/memes';

  return <></>;
};
export default Home;
