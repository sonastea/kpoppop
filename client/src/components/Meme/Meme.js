import { Container } from 'react-bootstrap';
import Comments from './Comments';
import Content from './Content';

const Meme = (props) => {

  return (
    <>
      <Container fluid className='mt-3'>
        <Content {...props} />
        <Comments />
      </Container>
    </>
  )
};

export default Meme;