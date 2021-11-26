import { Nav, Navbar, Offcanvas } from 'react-bootstrap';

const MobileNav = () => {
  return (
    <Nav>
      <Navbar.Toggle id="hamburgerToggle" aria-controls="mobileNav" />
      <Navbar.Offcanvas
        id="mobileNav"
        aria-labelledby="mobileNav"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="mobileNav">KPOPOP</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link href="/memes">Memes</Nav.Link>
            <Nav.Link href="/signup">Signup</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Nav>
  );
};

export default MobileNav;
