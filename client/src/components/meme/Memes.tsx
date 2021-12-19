import Buttons from './Buttons';
import UploadMeme from './UploadMeme';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Col, Container, Row, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchMemes } from './MemeAPI';

let cursor: number = 0;

const Memes = () => {
  const [posts, setPosts] = useState([] as any);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {
    setLoading(false);
    const memes = await fetchMemes(cursor);
    if (memes.length !== 0) {
      setPosts((prev: any) => [...prev, ...memes]);
      cursor = memes[memes.length - 1].id;
    } else {
      window.removeEventListener('scroll', handleScroll.current);
    }
  };

  const fetchData = debounce(loadMorePosts, 1000);

  const handleScroll = useRef((e: any) => {
    const { innerHeight, scrollY } = e.currentTarget;

    if (!loading && innerHeight + scrollY >= document.body.scrollHeight) {
      setLoading(true);
      fetchData();
    }
  });

  useEffect(() => {
    const handleScrollRef: any = handleScroll.current;
    const loadPosts = async () => {
      const memes = await fetchMemes(cursor);
      if (memes.length !== 0) {
        setPosts((prev: any) => [...prev, ...memes]);
        cursor = memes[memes.length - 1].id;
      }
    };
    loadPosts();

    window.addEventListener('scroll', handleScrollRef);
    return () => {
      window.removeEventListener('scroll', handleScrollRef);
    };
  }, []);

  return (
    <>
      <UploadMeme />
      <Container fluid>
        {posts &&
          posts.map((meme: any) => (
            <Row style={{ marginBottom: 16 }} id={meme.id} key={meme.id}>
              <Col xs="auto" md="auto" lg="auto">
                <a href={`/meme/${meme.id}/${meme.title}`}>
                  <Image className="meme-thumbnail" src={meme.url} />
                </a>
              </Col>
              <Col className="position-relative">
                <Buttons {...meme} />
              </Col>
            </Row>
          ))}
        <div onScroll={handleScroll.current} id="scroll-load-div" className="page-number m-5">
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </div>
      </Container>
    </>
  );
};

export default Memes;
