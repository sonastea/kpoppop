import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { likeMeme, unlikeMeme } from './MemeAPI';

type InteractiveButtonProps = {
  memeId: number;
  memeTitle: string;
  liked: boolean;
  comments: number;
  likes: number;
};

const InteractiveButtons = (props: InteractiveButtonProps) => {
  const { user } = useAuth();
  const { memeId, memeTitle, liked, comments, likes } = props;
  const [likedState, setLiked] = useState<boolean>(liked);
  const [totalLikes] = useState<number>(likes);
  const [totalComments] = useState<number>(comments);

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
      toast.warning('You must be logged in to like this meme.')
    }
  };

  return (
    <div className="py-2 md:py-4 flex flex-wrap justify-center gap-x-4">
      <div className="group like" onClick={handleLiked} role="button" aria-label="like">
        {likedState ? (
          <FontAwesomeIcon
            className="group-hover:text-red-500/80 md:text-lg liked"
            icon={fasHeart}
          />
        ) : (
          <FontAwesomeIcon className="group-hover:text-red-500 md:text-lg" icon={faHeart} />
        )}
        <span className="group-hover:text-red-500 ml-1 text-gray-700">
          {totalLikes ? `${totalLikes}` : `0`}
        </span>
      </div>
      <div className="group comments" role="button" aria-label="comments">
        <a href={`/meme/${memeId}/${memeTitle}`}>
          <FontAwesomeIcon
            className="group-hover:text-cyan-500 md:text-lg comments"
            icon={faComment}
          />
          <span className="group-hover:text-cyan-500 ml-1 text-gray-700">
            {totalComments ? `${totalComments}` : `0`}
          </span>
        </a>
      </div>
    </div>
  );
};

export default InteractiveButtons;
