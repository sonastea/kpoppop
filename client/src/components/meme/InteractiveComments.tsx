import { useAuth } from 'contexts/AuthContext';
import { API_URL } from 'Global.d';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Comment from './Comment';
import { fetchMemeComments } from './MemeAPI';

type InteractiveCommentsProps = {
  memeId: number;
  ownerId: number;
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

const InteractiveComments = (props: InteractiveCommentsProps) => {
  const [comments, setComments] = useState<CommentProps[] | undefined>([]);
  const [isCommenting, setIsCommenting] = useState<boolean>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState<string>();
  const { user } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      await fetchMemeComments(props.memeId)
        .then((data) => {
          setComments(data.comments);
        })
        .catch((_error) => {});
    };
    loadComments();
  }, [user?.role, props.memeId]);

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
          setComments((prev: any) => [data, ...prev]);
        } else {
          alert('There was an error uploading your comment.');
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
      <form className="space-y-2 space-x-2 flex-wrap items-center p-1 flex justify-center overflow-auto">
        <img
          className="rounded-full w-12 h-12 max-w-12 max-h-12"
          src={user && user?.photo ? user.photo : '/images/default_photo_white_200x200.png'}
          alt="user by comment box"
        />
        <textarea
          className="m-2 px-2 h-6 w-full max-w-2xl overflow-hidden text-center rounded-md bg-gray-100 focus:outline-none focus:border-once border"
          name="comment"
          placeholder="Add comment"
          value={comment}
          ref={textAreaRef}
          onChange={(e) => addCommentEventHandler(e)}
        />
        <div className="flex-shrink text-sm w-6">
          <span
            className={`${
              textAreaRef.current &&
              textAreaRef.current.value.length > 640 &&
              'text-error font-bold'
            }`}
          >
            {textAreaRef.current?.value.length}
          </span>
        </div>
        <button
          type="button"
          className={`${
            isCommenting ? 'bg-once-200 cursor-not-allowed' : 'bg-once'
          } self-center p-1 rounded-md hover:bg-once-400`}
          onClick={() => addComment(props.memeId)}
          disabled={isCommenting ? true : false}
        >
          Comment
        </button>
      </form>

      {comments &&
        comments.map((comment: CommentProps) => {
          return <Comment props={comment} memeOwnerId={props.ownerId} key={comment.id} />;
        })}
    </>
  );
};
export default InteractiveComments;
