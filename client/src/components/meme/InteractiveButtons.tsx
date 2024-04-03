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
    <div className="flex flex-wrap justify-center py-2 md:py-4">
      <div className="flex w-20 items-center justify-center">
        <div
          className="like group p-0.5 focus-visible:bg-red-500/40 focus-visible:outline-1"
          role="button"
          aria-label="like"
          onClick={handleLiked}
          onKeyDown={(e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
              handleLiked();
            }
          }}
          tabIndex={0}
        >
          {likedState ? (
            <FontAwesomeIcon
              className="liked group-hover:text-red-500/80 group-focus-visible:text-red-500/80
                md:text-lg"
              icon={fasHeart}
            />
          ) : (
            <FontAwesomeIcon className="group-hover:text-red-500 md:text-lg" icon={faHeart} />
          )}
          <span className="ml-1 overflow-hidden text-gray-700 group-hover:text-red-500">
            {totalLikes ? `${shortForm(totalLikes)}` : `0`}
          </span>
        </div>
      </div>
      <div
        className="comments flex w-20 items-center justify-center"
      >
        <a
          role="button"
          aria-label="comments"
          className="comments group p-0.5 focus-visible:bg-cyan-500/40"
          href={`/meme/${memeId}/${memeTitle}`}
        >
          <FontAwesomeIcon
            className="comments group-hover:text-cyan-500 md:text-lg"
            icon={faComment}
          />
          <span className="ml-1 overflow-hidden text-gray-700 group-hover:text-cyan-500">
            {totalComments ? `${shortForm(totalComments)}` : `0`}
          </span>
        </a>
      </div>
    </div>
  );
};

export default InteractiveButtons;
