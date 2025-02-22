import UserMenu from 'components/user/UserMenu';
import UserTooltip from 'components/user/UserTooltip';
import { useAuth } from 'contexts/AuthContext';
import { BaseSyntheticEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify/unstyled';
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

  const user_bg = ['self-center', 'rounded-md', 'ml-2']
    .concat(
      comment.user.id === props.memeOwnerId && comment.user.role !== 'ADMIN'
        ? ['text-white', 'bg-once-900']
        : [],
      comment.user.role === 'ADMIN' ? ['bg-once-500'] : [],
      comment.user.role === 'MODERATOR' ? ['bg-blue-400'] : []
    )
    .join(' ');

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
    <div className="comment-container p-2" ref={containerRef}>
      <div className="mb-1 flex flex-wrap gap-x-2 font-bold">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet={
              comment.user.photo
                ? `${comment.user.photo}?tr=w-72`
                : '/images/default_photo_white_200x200.png'
            }
          />
          <img
            className="h-12 w-12 rounded-full"
            src={
              comment.user.photo
                ? `${comment.user.photo}?tr=w-100`
                : '/images/default_photo_white_200x200.png'
            }
            alt={`${comment.user.username} profile`}
          />
        </picture>
        <span className={user_bg}>
          <UserTooltip comment={comment} />
        </span>
        <span className="ml-auto">
          <UserMenu comment={comment} />
        </span>
      </div>
      <div className="break-words text-sm text-slate-800 sm:text-lg">
        <p className="whitespace-pre-wrap" ref={textRef}>
          {comment.text}
        </p>
        {comment.edited && (
          <p className="text-right text-xs text-gray-400/90">
            Edited{' '}
            {`${new Date(comment.updatedAt).toLocaleTimeString()} ${new Date(
              comment.updatedAt
            ).toLocaleDateString()}`}
          </p>
        )}
      </div>
      <div
        aria-label="edit-comment-input"
        className="hidden h-60 break-words rounded-md bg-gray-200/60 text-xs text-slate-800
          sm:text-lg"
        ref={newTextRef}
      >
        <div className="flex h-full rounded-md text-center">
          <textarea
            className="focus:outline-hidden h-full w-full resize-none rounded-md border
              bg-gray-200/60 p-2 focus:border-once"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex flex-col place-content-between">
            <p className={`${newComment && newComment.length > 640 && 'text-red-500'} m-1`}>
              {newComment?.length}
            </p>
            <button
              type="button"
              className="m-1 h-min self-end rounded-md bg-once p-1"
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
