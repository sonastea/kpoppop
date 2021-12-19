import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchMeme } from './MemeAPI';

const Content = () => {
  const { memeid } = useParams();
  const [meme, setMeme] = useState({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeme = async (id: number) => {
      setLoading(true);
      await fetchMeme(id).then((data) => setMeme(data));
      setLoading(false);
    };
    loadMeme(parseInt(memeid!));
  }, [setMeme, memeid]);

  return loading ? (
    <FontAwesomeIcon id="scroll-load-div" icon={faSpinner} spin />
  ) : (
    <>
      <Row className="d-flex flex-wrap align-items-center content-header">
        <Col xs="auto" md="auto">
          <Image style={{ width: 240, height: 'auto' }} src={meme.url} alt="no image" />
        </Col>
        <Col>
          <Row>
            <div className="content-title">{meme.title}</div>
            <Row className="author-bar mt-1">
              <a className="author author-buttons" href={`/profile${meme.username}`}>
                {meme.author.username}
              </a>
            </Row>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Content;
