import Buttons from './Buttons';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Col, Container, Row, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchMemes } from './MemeAPI';
import Like from './Like';

let cursor: number = 0;

const Memes = () => {
  const [posts, setPosts] = useState([] as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchMemes(cursor)
        .then((memes) => {
          if (memes.length !== 0) {
            setPosts((prev: any) => [...prev, ...memes]);
            cursor = memes[memes.length - 1].id;
          }
        })
        .catch((_error) => {});
    };

    loadData().catch((error) => console.log(error));

    const handleScrollRef: any = handleScroll.current;
    window.addEventListener('scroll', handleScrollRef);
    return () => {
      window.removeEventListener('scroll', handleScrollRef);
    };
  }, []);

  const loadMorePosts = async () => {
    setLoading(false);
    await fetchMemes(cursor)
      .then((memes) => {
        if (memes.length !== 0) {
          setPosts((prev: any) => [...prev, ...memes]);
          cursor = memes[memes.length - 1].id;
        } else {
          window.removeEventListener('scroll', handleScroll.current);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchData = debounce(loadMorePosts, 1000);

  const handleScroll = useRef((e: any) => {
    const { innerHeight, scrollY } = e.currentTarget;

    if (!loading && innerHeight + scrollY >= document.body.scrollHeight) {
      setLoading(true);
      fetchData();
    }
  });

  return (
    <>
      <Container>
        {posts &&
          posts.map((meme: any) => {
            if (meme.active) {
              return (
                <Row className="meme rounded-2 mt-3 mb-3" id={meme.id} key={meme.id}>
                  <Col xs={6} md={3} lg={4}>
                    <a href={`/meme/${meme.id}/${meme.title}`}>
                      <Image className="mt-2 meme-thumbnail rounded-2" src={meme.url} fluid />
                    </a>
                  </Col>
                  <Col className="d-flex flex-column">
                    <Buttons {...meme} />
                  </Col>
                  <Like memeId={meme.id} />
                </Row>
              );
            } else {
              return null;
            }
          })}
        <div onScroll={handleScroll.current} id="scroll-load-div" className="page-number p-5">
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </div>
      </Container>
    </>
  );
};

export default Memes;
