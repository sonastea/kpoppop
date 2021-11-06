import { NavDropdown } from 'react-bootstrap';

const LoggedInUser = (props) => {
  return (
    <NavDropdown id='profile-dropdown' className='ml-auto' title={props.username}>
      <NavDropdown.Item href={'/profile/' + props.username }>Profile</NavDropdown.Item>
      <NavDropdown.Item href='/logout'>logout</NavDropdown.Item>
    </NavDropdown>
  )
}

export default LoggedInUser;