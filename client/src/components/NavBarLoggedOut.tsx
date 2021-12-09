import { Nav } from 'react-bootstrap';

const NavBarLoggedOut = (props: any) => {
  if (props.username !== null) {
    return null;
  } else {
    return (
      <>
        <Nav className="ms-auto d-none d-md-block">
          <Nav.Link href="/register">Sign Up</Nav.Link>
        </Nav>
        <Nav className="d-none d-md-block">
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
      </>
    );
  }
};

export default NavBarLoggedOut;
