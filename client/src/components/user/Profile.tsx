import { useAuth } from 'contexts/AuthContext';
import { useParams } from 'react-router-dom';
import MyProfile from './MyProfile';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();

  if (user?.id) {
    return <MyProfile />;
  }
  return <div>{username}</div>;
};

export default Profile;
