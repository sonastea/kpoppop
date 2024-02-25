import UserMenu from 'components/user/UserMenu';
import UserTooltip from 'components/user/UserTooltip';
import { useAuth } from 'contexts/AuthContext';
import { BaseSyntheticEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CommentButtons from './CommentButtons';
import CommentModerationButtons from './CommentModerationButtons';
import { CommentProps } from './InteractiveComments';
import { editComment } from './MemeAPI';

const MAX_COMMENT_CHAR_LENGTH: number = 640;

const Comment = (props: { props: CommentProps; memeOwnerId: number }) => {
  const [comment, setComment] = useState<CommentProps>(props.props);
  const [newComment, setNewComment] = useState<string>(props.props.text);
  const containerRef = useRef<HTMLDivElement>(null);
  const newTextRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isAuthor = comment.user.id === user?.id;

  const user_bg = ['self-center', 'rounded-md', 'ml-2'].concat(
    comment.user.id === props.memeOwnerId && comment.user.role !== 'ADMIN'
      ? 'text-white bg-once-900'
      : [],
    comment.user.role === 'ADMIN' ? 'bg-once-500' : [],
    comment.user.role === 'MODERATOR' ? 'bg-blue-400' : []
  );

  const handleEditComment = async (_e: BaseSyntheticEvent) => {
    if (newComment?.length > MAX_COMMENT_CHAR_LENGTH) {
      toast.error(`Comment exceeds maximum limit of ${MAX_COMMENT_CHAR_LENGTH} characters.`);
      return;
    }

    await editComment(newComment, comment.id).then(
      (data: { id: number; text: string; updatedAt: string; edited: boolean }) => {
        if (data.id) {
          newTextRef?.current?.classList.add('hidden');
          textRef?.current?.parentElement?.classList.remove('hidden');
          setComment((prev) => ({
            ...prev,
            text: data.text,
            updatedAt: data.updatedAt,
            edited: data.edited,
            user: {
              ...prev.user,
            },
          }));
        }

        // there is surely a nicer way to do this
        if (containerRef.current) {
          containerRef.current.children[3].children[1].children[1].classList.remove('text-red-500');
          containerRef.current.children[3].children[1].children[1].textContent = 'Edit';
        }
      }
    );
  };

  return (
    <div className="p-2 comment-container" ref={containerRef}>
      <div className="font-bold gap-x-2 flex flex-wrap mb-1">
        <img
          className="w-12 h-12 rounded-full"
          src={comment.user.photo ? comment.user.photo : '/images/default_photo_white_200x200.png'}
          alt={`${comment.user.username} profile`}
        />
        <span className={user_bg.join(' ')}>
          <UserTooltip comment={comment} />
        </span>
        <span className="ml-auto">
          <UserMenu comment={comment} />
        </span>
      </div>
      <div className="text-slate-800 text-sm sm:text-lg break-words">
        <p className="whitespace-pre-wrap" ref={textRef}>
          {comment.text}
        </p>
        {comment.edited && (
          <p className="text-xs text-right text-gray-400/90">
            Edited{' '}
            {`${new Date(comment.updatedAt).toLocaleTimeString()} ${new Date(
              comment.updatedAt
            ).toLocaleDateString()}`}
          </p>
        )}
      </div>
      <div
        aria-label="edit-comment-input"
        className="hidden rounded-md h-60 bg-gray-200/60 text-slate-800 text-xs sm:text-lg break-words"
        ref={newTextRef}
      >
        <div className="rounded-md h-full flex text-center">
          <textarea
            className="focus:outline-none focus:border-once border resize-none p-2 h-full w-full bg-gray-200/60 rounded-md"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex flex-col place-content-between">
            <p className={`${newComment && newComment.length > 640 && 'text-red-500'} m-1`}>
              {newComment?.length}
            </p>
            <button
              type="button"
              className="m-1 self-end p-1 bg-once rounded-md h-min"
              onClick={(e: BaseSyntheticEvent) => handleEditComment(e)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {isAuthor && <CommentButtons commentId={comment.id} containerRef={containerRef} />}
      {!isAuthor && <CommentModerationButtons commentId={comment.id} />}
    </div>
  );
};
export default Comment;
