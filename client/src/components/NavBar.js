import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import LoggedInUser from './LoggedInUser';
import LoggedOutUser from './LoggedOutUser';

const NavBar = (props) => {
  return (
    <Navbar bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>KPOPOP</Navbar.Brand>
        <Nav className='me-auto'>
          <Nav.Link href='/memes'>Memes</Nav.Link>
        </Nav>
        {props.isLoggedIn
          ? <LoggedInUser username={props.username} />
          : <LoggedOutUser />
        }
      </Container>
    </Navbar>
  );
}

export default NavBar;