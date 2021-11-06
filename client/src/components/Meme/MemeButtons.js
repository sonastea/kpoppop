import LikeMeme from "./LikeMeme";
import { Col, Row } from 'react-bootstrap';
import { useContext } from "react";
import AuthContext from '../../contexts/AuthContext';

const MemeButtons = (props) => {
  const { id, username } = props;
  const user = useContext(AuthContext);
  const url = process.env.REACT_APP_MEME_HREF;
  const title = props.title.replace(/ /g, "_");

  return (
    <>
      <Row className='title position-absolute start-0 top-0'>
        <Col id={id}>
          <a className='meme-buttons' href={`${url}${id}/${title}`}>
            {props.title}
          </a>
        </Col>
        <Row className='author-bar'>
          <a className='author author-buttons' href={`/profile/${username}`}>
            {username}
          </a>
        </Row>
      </Row>
      <Row className='position-absolute bottom-0 start-0'>
        <Col className='comments align-self-end'>
          <a className='meme-buttons' href={`${url}${id}/${title}`}>Comments</a>
        </Col>
        <LikeMeme
          memeId={id}
          userId={user['user-id']}
        />
      </Row>
    </>
  )
};

export default MemeButtons;