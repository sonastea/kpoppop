import { Container, Navbar } from 'react-bootstrap';
import MobileNav from './MobileNav';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';

const NavBar = (props: any) => {
  return (
    <Navbar id="navbar" variant="light" expand="md" collapseOnSelect sticky="top">
      <Container>
        <Navbar.Brand href="/">KPOPOP</Navbar.Brand>
        {props.username && <NavBarLoggedIn username={props.username} />}
        <NavBarLoggedOut username={props.username} />
        <MobileNav />
      </Container>
    </Navbar>
  );
};

export default NavBar;
