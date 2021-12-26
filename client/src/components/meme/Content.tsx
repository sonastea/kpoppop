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
      <Row className="content-header">
        <Col xs={6} md={4} lg={4}>
          <Image className="mt-2 rounded-2" src={meme.url} alt="no image" fluid />
        </Col>
        <Col className="d-flex flex-column">
          <Row className="content-title">
            <Col>{meme.title}</Col>
          </Row>
          <Row className="mt-auto author-bar">
            <Col>
              <a href={`/profile${meme.username}`}>{meme.author.username}</a>
            </Col>
          </Row>
        </Col>
        <PostButtons memeId={parseInt(memeid!, 10)} />
      </Row>
    </>
  );
};

export default Content;
