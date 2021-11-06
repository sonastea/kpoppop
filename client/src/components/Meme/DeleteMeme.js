import { Col } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
import { LoginStatus } from '../auth/LoginStatus';
import AuthContext from '../../contexts/AuthContext';


const DeleteMeme = (props) => {
  const { user_id } = props;
  const user = useContext(AuthContext);

  useEffect(() => {
    try {
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const handleDelete = async () => {
    if (LoginStatus()) {
      // true
    } else {
      window.alert('You must be logged in.');
    }
  };

  return (
    <>
      {user_id === JSON.parse(user['user-id']) &&
        <Col onClick={handleDelete} className='delete-meme align-self-end' xs='auto' md='auto'>
          delete
        </Col>
      }
    </>
  )
};

export default DeleteMeme;