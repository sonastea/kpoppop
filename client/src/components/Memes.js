import { debounce } from "lodash";
import { fetchMemes } from "./API";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MemeButtons from "./Meme/MemeButtons";

const Memes = (props) => {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const increasePage = () => {
    setPage((page) => page + 1);
  };

  const fetchData = debounce(increasePage, 1000);

  const handleScroll = useRef((e) => {
    const { innerHeight, scrollY } = e.currentTarget;

    if (!loading && innerHeight + scrollY >= document.body.scrollHeight) {
      setLoading(true);
      fetchData();
    }
  });

  useEffect(() => {
    const loadMemes = async () => {
      const memes = await fetchMemes(page);
      if (memes.length !== 0) {
        setImages((prev) => [...prev, ...memes]);
      } else {
        window.removeEventListener("scroll", handleScroll.current);
      }
      setLoading(false);
    };
    loadMemes();

    window.addEventListener("scroll", handleScroll.current);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, handleScroll]);

  return (
    <>
      <Container fluid>
        {images &&
          images.map((meme) => (
            <Row style={{ marginBottom: 16 }} id={meme.id} key={meme.id}>
              <Col xs="auto" md="auto" lg="auto">
                {meme.length === 0 ? (
                  <Image className="meme-thumbnail" src={meme.url} />
                ) : (
                  <Image
                    className="meme-thumbnail"
                    src={`http://localhost:5000/${meme.path}`}
                  />
                )}
              </Col>
              <Col className="position-relative">
                <MemeButtons {...meme} />
              </Col>
            </Row>
          ))}
        <div
          onScroll={handleScroll.current}
          id="scroll-load-div"
          className="page-number m-5"
        >
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </div>
      </Container>
    </>
  );
};

export default Memes;
