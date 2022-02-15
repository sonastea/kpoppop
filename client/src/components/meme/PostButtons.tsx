import { Row } from 'react-bootstrap';
import Like, { LikeProps } from './Like';

const PostButtons = (props: LikeProps) => {
  return (
    <>
      <Row className="list-buttons mt-2">
        <Like memeId={props.memeId} />
      </Row>
    </>
  );
};

export default PostButtons;
