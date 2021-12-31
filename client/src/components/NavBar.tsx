import { Container, Nav, Navbar } from 'react-bootstrap';
import useAuth from '../contexts/AuthContext';
import MobileNav from './MobileNav';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';

const NavBar = () => {
  const { user } = useAuth();

  return (
    <>
    <Navbar id="navbar" expand="md" collapseOnSelect sticky="top">
      <Container fluid>
        <Navbar.Brand href="/">KPOPPOP</Navbar.Brand>
        <Nav.Link className="ml-auto d-none d-md-block" href="/memes">
          Memes
        </Nav.Link>
        {user?.username && <NavBarLoggedIn />}
        <NavBarLoggedOut />
        <MobileNav />
      </Container>
    </Navbar>
    </>
  );
};

export default NavBar;
