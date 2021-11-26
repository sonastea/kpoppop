import {  Nav, Navbar } from 'react-bootstrap';
import MobileNav from './MobileNav';

const NavBar = () => {
  return (
    <Navbar id="navbar" variant="light" expand="md" collapseOnSelect sticky="top">
      <Navbar.Brand href="/">KPOPOP</Navbar.Brand>
      <Nav className="me-auto d-none d-md-block">
        <Nav.Link href="/memes">Memes</Nav.Link>
      </Nav>
      <Nav className="ml-auto d-none d-md-block">
        <Nav.Link href="/register">Sign Up</Nav.Link>
      </Nav>
      <Nav className="ml-auto d-none d-md-block">
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav>
      <MobileNav />
    </Navbar>
  );
};

export default NavBar;
