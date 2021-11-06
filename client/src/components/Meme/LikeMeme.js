import { Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { fetchMemeTotalLikes, fetchMemeUserLike, likeMeme, unlikeMeme } from '../API';
import { LoginStatus } from '../auth/LoginStatus';


const LikeMeme = ({ memeId, userId }) => {
  const [likedState, setLiked] = useState(false);
  const [totalLikes, setLikes] = useState();

  const setTotalLikes = (likes) => { setLikes(likes); }

  useEffect(() => {
    const fetchLikes = async (memeId) => {
      const likes = await fetchMemeTotalLikes(memeId);
      const liked = await fetchMemeUserLike(memeId, userId);
      setTotalLikes(likes);
      setLiked(liked);
    }
    try {
      fetchLikes(memeId);
    } catch (err) {
      console.log(err.message);
    }
  }, [memeId, userId, likedState]);

  const handleLiked = async () => {
    if (LoginStatus()) {
      if (!likedState) {
        await likeMeme(memeId, userId);
        setLiked(prev => !prev);
      } else if (likedState) {
        await unlikeMeme(memeId, userId);
        setLiked(prev => !prev);
      }
    } else {
      window.alert('You must be logged in to like a meme.');
    }
  };

  return (
    <>
      <Col onClick={handleLiked} className='delete-meme align-self-end' xs='auto' md='auto'>
        {likedState
          ? <FontAwesomeIcon className='liked' icon={fasHeart} />
          : <FontAwesomeIcon icon={faHeart} />
        }
        {` ${totalLikes}`}
      </Col>
    </>
  )
};

export default LikeMeme;