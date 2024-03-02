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
  const [totalLikes, setTotalLikes] = useState<number>(likes);
  const [totalComments] = useState<number>(comments);

  const handleLiked = async () => {
    if (user?.id) {
      if (!likedState) {
        await likeMeme(memeId).then((res) => {
          if (res.LikeMeme === true) {
            setTotalLikes((prev) => ++prev);
            setLiked(true);
          }
          if (res.LikeMeme.error) toast.error(res.LikeMeme.error);
        });
      } else if (likedState) {
        await unlikeMeme(memeId).then((res) => {
          if (res.UnlikeMeme === true) {
            setTotalLikes((prev) => --prev);
            setLiked(false);
          }
          if (res.UnlikeMeme.error) toast.error(res.UnlikeMeme.error);
        });
      }
    } else {
      toast.warning('You must be logged in to like this meme.');
    }
  };

  const shortForm = (number: number) => {
    return Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(number);
  };

  return (
    <div className="py-2 md:py-4 flex flex-wrap justify-center">
      <div className="flex justify-center items-center w-20">
        <div className="group like" onClick={handleLiked} role="button" aria-label="like">
          {likedState ? (
            <FontAwesomeIcon
              className="group-hover:text-red-500/80 md:text-lg liked"
              icon={fasHeart}
            />
          ) : (
            <FontAwesomeIcon className="group-hover:text-red-500 md:text-lg" icon={faHeart} />
          )}
          <span className="group-hover:text-red-500 ml-1 text-gray-700 overflow-hidden">
            {totalLikes ? `${shortForm(totalLikes)}` : `0`}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center comments w-20">
        <a
          role="button"
          aria-label="comments"
          className="group comments"
          href={`/meme/${memeId}/${memeTitle}`}
        >
          <FontAwesomeIcon
            className="group-hover:text-cyan-500 md:text-lg comments"
            icon={faComment}
          />
          <span className="group-hover:text-cyan-500 ml-1 text-gray-700 overflow-hidden">
            {totalComments ? `${shortForm(totalComments)}` : `0`}
          </span>
        </a>
      </div>
    </div>
  );
};

export default InteractiveButtons;
