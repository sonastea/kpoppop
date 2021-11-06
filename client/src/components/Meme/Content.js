import { fetchMeme } from '../API';
import { useEffect, useState } from 'react';
import { Image, Col, Row } from 'react-bootstrap';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListButtons from './ListButtons';

const Content = (props) => {
  const [meme, setMeme] = useState({});
  const { memeid } = props.match.params;
  const url = process.env.REACT_APP_IMAGE_URL;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeme = async (id) => {
      setLoading(true);
      await fetchMeme(id).then(data => setMeme(data));
      setLoading(state => !state);
    };
    loadMeme(memeid);
  }, [setMeme, memeid]);

  return (loading
    ?  <FontAwesomeIcon id='scroll-load-div' icon={faSpinner} spin />
    :
    <>
      <Row className='d-flex flex-wrap align-items-center content-header' key={meme.id}>
        <Col xs='auto' md='auto'>
          {meme.length === 0
            ?
            <Image style={{ width: 240, height: 'auto' }} src={meme.url} alt='no image' />
            :
            <Image style={{ width: 240, height: 'auto' }} src={`${url}${meme.path}`} alt='no image' />
          }
        </Col>
        <Col>
          <Row>
            <div className='content-title'>
              {meme.title}
            </div>
            <Row className='author-bar mt-1'>
              <a className='author author-buttons' href={`/profile/${meme.username}`}>
                {meme.username}
              </a>
            </Row>
          </Row>
        </Col>
        <ListButtons {...meme} />
      </Row>
    </>
  );
};

export default Content;