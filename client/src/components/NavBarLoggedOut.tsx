import { useAuth } from '../contexts/AuthContext';

const NavBarLoggedOut = () => {
  const { user } = useAuth();

  if (user?.username) {
    return null;
  } else {
    return (
      <>
      </>
    );
  }
};

export default NavBarLoggedOut;
