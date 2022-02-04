import { Col, Row } from 'react-bootstrap';

const Buttons = (props: any) => {
  const {
    id,
    author: { username },
  } = props;
  const title = props.title.replace(/ /g, '_');

  return (
    <>
      <Row className="content-title">
        <Col>
          <a className="meme-buttons" href={`/meme/${id}/${title}`}>
            {props.title}
          </a>
        </Col>
      </Row>
      <Row className="author-bar mt-1">
        <Col>
        <a className="author-bar meme-buttons" href={`/user/profile/${username}`}>
            {username}
          </a>
        </Col>
      </Row>
      <Row className="mt-auto">
        <Col>
          <a className="comments meme-buttons" href={`/meme/${id}/${title}`}>
            Comments
          </a>
        </Col>
      </Row>
    </>
  );
};

export default Buttons;
