import { useAuth } from '../contexts/AuthContext';

const NavBarLoggedIn = () => {
  const { user, logout } = useAuth();

  const logoutHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="ms-auto d-none d-md-block" title={user?.username}>
      <a href={`/user/profile/${user?.username}`}>Profile</a>
      <div onClick={logoutHandler}>logout</div>
    </div>
  );
};

export default NavBarLoggedIn;
