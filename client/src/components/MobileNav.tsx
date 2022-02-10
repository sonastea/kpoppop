import { Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const MobileNav = () => {
  const { user, logout } = useAuth();

  const logoutHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    logout();
  };

  return (
    <Nav>
      <Navbar.Toggle id="hamburgerToggle" aria-controls="mobileNav" />
      <Navbar.Offcanvas scroll={true} id="mobileNav" aria-labelledby="mobileNav" placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="mobileNav">KPOPPOP</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link href="/memes">Memes</Nav.Link>
            {user?.username && (
              <>
                <Nav.Link href={`/user/profile/${user.username}`}>{user.username}</Nav.Link>
                <Nav.Link onClick={logoutHandler}>logout</Nav.Link>
              </>
            )}
            {!user?.username && (
              <>
                <Nav.Link href="/register">Signup</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Nav>
  );
};

export default MobileNav;
