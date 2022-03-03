import { useAuth } from 'contexts/AuthContext';

const MyProfile = () => {
  const { user } = useAuth();

  return <div id="profileTable">Hello, {user?.username} </div>;
};

export default MyProfile;
