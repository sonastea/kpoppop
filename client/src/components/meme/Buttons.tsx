import { Col, Row } from 'react-bootstrap';
import Like from './Like';

const Buttons = (props: any) => {
  const {
    id,
    author: { username },
  } = props;
  const title = props.title.replace(/ /g, '_');

  return (
    <>
      <Row className="title position-absolute start-0 top-0">
        <Col id={id}>
          <a className="meme-buttons" href={`/meme/${id}/${title}`}>
            {props.title}
          </a>
        </Col>
        <Row className="author-bar">
          <a className="author author-buttons" href={`/profile/${username}`}>
            {username}
          </a>
        </Row>
      </Row>
      <Row className="position-absolute bottom-0 start-0">
        <Col className="comments align-self-end">
          <a className="meme-buttons" href={`/meme/${id}/${title}`}>
            Comments
          </a>
        </Col>
        <Like memeId={id}/>
      </Row>
    </>
  );
};

export default Buttons;
