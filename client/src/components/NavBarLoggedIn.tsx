import { NavDropdown } from 'react-bootstrap';
import useAuth from '../contexts/AuthContext';
import Logout from './auth/Logout';

const NavBarLoggedIn = () => {
  const { user } = useAuth();

  const logoutHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    Logout();
  };

  return (
    <NavDropdown align="end" id="profile-dropdown" className="ms-auto d-none d-md-block" title={user?.username}>
      <NavDropdown.Item href={`/user/profile/${user?.username}`}>Profile</NavDropdown.Item>
      <NavDropdown.Item onClick={logoutHandler}>logout</NavDropdown.Item>
    </NavDropdown>
  );
};

export default NavBarLoggedIn;
