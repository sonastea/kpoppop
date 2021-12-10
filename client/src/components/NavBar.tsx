import { Container, Nav, Navbar } from 'react-bootstrap';
import MobileNav from './MobileNav';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';

const NavBar = (props: any) => {
  return (
    <Navbar id="navbar" expand="md" collapseOnSelect sticky="top">
      <Container>
        <Navbar.Brand href="/">KPOPOP</Navbar.Brand>
        <Nav.Link className="me-auto d-none d-md-block" href="memes">
          Memes
        </Nav.Link>
        {props.username && <NavBarLoggedIn username={props.username} />}
        <NavBarLoggedOut username={props.username} />
        <MobileNav username={props.username} />
      </Container>
    </Navbar>
  );
};

export default NavBar;
