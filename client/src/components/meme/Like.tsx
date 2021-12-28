import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchMemeTotalLikes, fetchMemeUserLike, likeMeme, unlikeMeme } from './MemeAPI';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';

export type LikeProps = {
  memeId: number;
};

const Like = (props: LikeProps) => {
  const { memeId } = props;
  const [likedState, setLiked] = useState<boolean>();
  const [totalLikes, setLikes] = useState<number>();

  const setTotalLikes = (likes: number) => {
    setLikes(likes);
  };

  const handleLiked = async () => {
    if (!likedState) {
      await likeMeme(memeId);
      setLiked(true);
    } else if (likedState) {
      await unlikeMeme(memeId);
      setLiked(false);
    }
  };

  useEffect(() => {
    const fetchLikes = async (memeId: number) => {
      const likes = await fetchMemeTotalLikes(memeId);
      setTotalLikes(likes);

      await fetchMemeUserLike(memeId).then(response => {
        if (response.statusCode !== 401) { setLiked(response); }
      });
    };

    try {
      fetchLikes(memeId);
    } catch (error: any) {
      console.log(error.message);
    }
  }, [likedState, memeId]);

  return (
    <Row className="interactive-bar gx-0 justify-content-center" xs="auto" md="auto" lg="auto">
      <Col className="like-meme" onClick={handleLiked}>
        <span>
          {likedState ? (
            <FontAwesomeIcon className="liked" icon={fasHeart} />
          ) : (
            <FontAwesomeIcon icon={faHeart} />
          )}
          <span className="ms-1 interactive-buttons">{totalLikes ? `${totalLikes}` : `0`}</span>
        </span>
      </Col>
    </Row>
  );
};

export default Like;
