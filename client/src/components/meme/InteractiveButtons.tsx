import { useEffect, useState } from 'react';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchMemeTotalLikes, fetchMemeUserLike, likeMeme, unlikeMeme } from './MemeAPI';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';

export type InteractiveButtonProps = {
  memeId: number;
};

const InteractiveButtons = (props: InteractiveButtonProps) => {
  const { user } = useAuth();
  const { memeId } = props;
  const [likedState, setLiked] = useState<boolean>();
  const [totalLikes, setLikes] = useState<number>();
  const [totalComments, setTotalComments] = useState<number>();

  const setTotalLikes = (likes: number) => {
    setLikes(likes);
  };

  const handleLiked = async () => {
    if (user?.id) {
      if (!likedState) {
        await likeMeme(memeId);
        setLiked(true);
      } else if (likedState) {
        await unlikeMeme(memeId);
        setLiked(false);
      }
    } else {
      window.alert('You must be logged in to like this meme.');
    }
  };

  useEffect(() => {
    const fetchLikes = async (memeId: number) => {
      const likes = await fetchMemeTotalLikes(memeId);
      setTotalLikes(likes);

      if (user?.id) {
        await fetchMemeUserLike(memeId).then((response) => {
          if (response.statusCode !== 401) {
            setLiked(response);
          }
        });
      }
    };

    try {
      fetchLikes(memeId);
    } catch (error: any) {
      console.log(error.message);
    }
  }, [user, likedState, memeId]);

  return (
    <div className="flex justify-center text-md gap-3 md:text-xl">
      <div className="like" onClick={handleLiked} role="button" aria-label="like">
        {likedState ? <FontAwesomeIcon className="liked" icon={fasHeart} /> : <FontAwesomeIcon icon={faHeart} />}
        <span className="ml-1 text-gray-700 align-middle">{totalLikes ? `${totalLikes}` : `0`}</span>
      </div>
      {false && (
        <div className="comments" role="button" aria-label="comments">
          <FontAwesomeIcon className="align-middle comments" icon={faComment} />
          <span className="ml-1 text-gray-700 align-middle ">{totalComments ? `${totalComments}` : `0`}</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveButtons;