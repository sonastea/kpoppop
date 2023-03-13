import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
  fetchMemeTotalComments,
  fetchMemeTotalLikes,
  fetchMemeUserLike,
  likeMeme,
  unlikeMeme,
} from './MemeAPI';

type InteractiveButtonProps = {
  memeId: number;
  memeTitle: string;
};

const InteractiveButtons = (props: InteractiveButtonProps) => {
  const { user } = useAuth();
  const { memeId, memeTitle } = props;
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
      const comments = await fetchMemeTotalComments(memeId);
      setTotalLikes(likes);
      setTotalComments(comments);

      if (user && user.id) {
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
    <div className="py-4 flex flex-wrap justify-center gap-x-4">
      <div className="group like" onClick={handleLiked} role="button" aria-label="like">
        {likedState ? (
          <FontAwesomeIcon
            className="group-hover:text-red-500/80 md:text-lg liked text-sm"
            icon={fasHeart}
          />
        ) : (
          <FontAwesomeIcon className="group-hover:text-red-500 md:text-lg text-sm" icon={faHeart} />
        )}
        <span className="group-hover:text-red-500 ml-1 text-gray-700 align-middle">
          {totalLikes ? `${totalLikes}` : `0`}
        </span>
      </div>
      <div className="group comments" role="button" aria-label="comments">
        <a href={`/meme/${memeId}/${memeTitle}`}>
          <FontAwesomeIcon
            className="group-hover:text-cyan-500 md:text-lg align-middle comments text-sm"
            icon={faComment}
          />
          <span className="group-hover:text-cyan-500 ml-1 text-gray-700 align-middle ">
            {totalComments ? `${totalComments}` : `0`}
          </span>
        </a>
      </div>
    </div>
  );
};

export default InteractiveButtons;
