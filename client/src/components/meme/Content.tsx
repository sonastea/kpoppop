import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchMeme } from './MemeAPI';
import PostButtons from './PostButtons';

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
        <Col xs={6} md={6}>
          <Image src={meme.url} alt="no image" fluid />
        </Col>
        <Col>
          <Row>
            <Row className="content-title">{meme.title}</Row>
            <Row className="author-bar mt-1">
              <a className="author author-buttons" href={`/profile${meme.username}`}>
                {meme.author.username}
              </a>
            </Row>
          </Row>
        </Col>
        <PostButtons memeId={parseInt(memeid!, 10)} />
      </Row>
    </>
  );
};

export default Content;
