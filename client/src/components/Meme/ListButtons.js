import LikeMeme from './LikeMeme';
import { Row } from 'react-bootstrap';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import HideMeme from './HideMeme';
import DeleteMeme from './DeleteMeme';


const ListButtons = (props) => {
  const user = useContext(AuthContext);

  return (
    <>
      <Row className='list-buttons mt-2'>
        <LikeMeme 
          memeId={props.id}
          userId={JSON.parse(user['user-id'])}
        />
        <HideMeme {...props} />
        <DeleteMeme {...props} />
      </Row>
    </>
  )
};

export default ListButtons;