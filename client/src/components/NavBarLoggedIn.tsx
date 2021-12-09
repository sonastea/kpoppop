import { NavDropdown } from 'react-bootstrap';
import Logout from './auth/Logout';

const NavBarLoggedIn = (props: any) => {

  const logoutHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    Logout();
  }

  return (
    <NavDropdown id="profile-dropdown" className="ms-auto d-none d-md-block" title={props.username}>
    <NavDropdown.Item href="/user/profile">Profile</NavDropdown.Item>
      <NavDropdown.Item onClick={logoutHandler}>logout</NavDropdown.Item>
    </NavDropdown>
  );
};

export default NavBarLoggedIn;
