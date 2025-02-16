import { useAuth } from 'contexts/AuthContext';
import { API_URL } from 'Global.d';
import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Comment from './Comment';

type InteractiveCommentsProps = {
  memeId: number;
  ownerId: number;
  comments: CommentProps[];
};

export interface IUserProps {
  banner?: string;
  createdAt: string;
  displayname?: string;
  id: number;
  photo?: string;
  role: string;
  username: string;
  status: string;
}

export type CommentProps = {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  user: IUserProps;
};

const InteractiveComments = ({ memeId, ownerId, comments: c }: InteractiveCommentsProps) => {
  const [comments, setComments] = useState<CommentProps[]>(c);
  const [isCommenting, setIsCommenting] = useState<boolean>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState<string>();
  const { user } = useAuth();

  const addComment = async (id: number) => {
    setIsCommenting(true);
    await fetch(`${API_URL}/meme/comment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ comment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.createdAt) {
          setComment('');
          setComments((prev: CommentProps[]) => [data, ...prev]);
        } else {
          toast.error('There was an error uploading your comment.');
        }
      })
      .finally(() => setTimeout(() => setIsCommenting(false), 10000));
  };

  const addCommentEventHandler = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setComment(e.target.value);
  };

  return (
    <>
      <form
        className="flex flex-wrap items-center justify-center space-x-2 space-y-2 overflow-auto p-1"
      >
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet={
              user?.photo ? `${user.photo}?tr=w-72` : '/images/default_photo_white_200x200.png'
            }
          />
          <img
            className="h-12 max-h-12 w-12 max-w-12 rounded-full"
            alt="user by comment box"
            src={user?.photo ? `${user.photo}?tr=w-100` : '/images/default_photo_white_200x200.png'}
          />
        </picture>
        <textarea
          className="focus:outline-hidden m-2 h-6 w-full max-w-2xl overflow-hidden rounded-md border
            bg-gray-200/60 px-2 text-center focus:border-once"
          name="comment"
          placeholder="Add comment"
          value={comment}
          ref={textAreaRef}
          onChange={(e) => addCommentEventHandler(e)}
        />
        <div className="w-6 shrink text-sm">
          <span
            className={`${ textAreaRef.current && textAreaRef.current.value.length > 640 &&
              'font-bold text-error' }`}
          >
            {textAreaRef.current?.value.length ?? 0}
          </span>
        </div>
        <button
          type="button"
          className={`${isCommenting ? 'cursor-not-allowed bg-once-200' : 'bg-once'} self-center
            rounded-md p-1 hover:bg-once-400`}
          onClick={() => addComment(memeId)}
          disabled={isCommenting ? true : false}
        >
          Comment
        </button>
      </form>

      {comments &&
        comments.map((comment: CommentProps) => {
          return <Comment props={comment} memeOwnerId={ownerId} key={comment.id} />;
        })}
    </>
  );
};
export default InteractiveComments;
