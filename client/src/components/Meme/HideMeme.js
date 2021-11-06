import { Col } from 'react-bootstrap';
import Role from '../../helpers/role';
import { LoginStatus } from '../auth/LoginStatus';
import AuthContext from '../../contexts/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { hideMeme, unhideMeme } from './API';
import { Meme } from '../../helpers/meme';

const HideMeme = (props) => {
  const user = useContext(AuthContext);
  const [active, setActive] = useState(props.active);
  const user_id = JSON.parse(user['user-id']);

  useEffect(() => {
  }, [active]);

  const handleHide = async () => {
    if (LoginStatus()) {
      if (active === Meme.Status.Active) {
        await hideMeme(props.id, user_id);
        setActive(Meme.Status.Inactive);
      } else if (active === Meme.Status.Inactive) {
        await unhideMeme(props.id, user_id);
        setActive(Meme.Status.Active);
      }
    } else {
      window.alert('You must be logged in.');
    }
  };

  return (
    <>
      {user.role >= Role.Moderator &&
        <Col onClick={handleHide} className='hide-meme align-self-end' xs='auto' md='auto'>
          {active === Meme.Status.Active ? 'hide' : 'unhide' }
        </Col>
      }
    </>
  )
};

export default HideMeme;