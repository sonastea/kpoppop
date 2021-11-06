import { Nav } from 'react-bootstrap';

const LoggedOutUser = (props) => {
  return (
    <Nav className='ml-auto'>
      <Nav.Link href='/signup'>Signup</Nav.Link>
      <Nav.Link href='/login'>Login</Nav.Link>
    </Nav>
  )
}

export default LoggedOutUser;