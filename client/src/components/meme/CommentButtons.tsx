import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseSyntheticEvent, RefObject } from 'react';
import { deleteComment } from './MemeAPI';

const CommentButtons = (props: {
  commentId: number;
  containerRef: RefObject<HTMLDivElement | null>;
}) => {
  const { containerRef } = props;

  const handleDeleteComment = async () => {
    await deleteComment(props.commentId).then((data) => {
      if (data.id) containerRef.current?.remove();
    });
  };

  const toggleEditCommentState = async (e: BaseSyntheticEvent) => {
    if (containerRef !== null && !containerRef?.current?.children[1].className.includes('hidden')) {
      containerRef?.current?.children[1].classList.add('hidden');
      containerRef?.current?.children[2].classList.remove('hidden');
      (e.target as HTMLElement).classList.add('text-red-500');
      (e.target as HTMLElement).textContent = 'Cancel';
    } else {
      containerRef?.current?.children[1].classList.remove('hidden');
      containerRef?.current?.children[2].classList.add('hidden');
      (e.target as HTMLElement).classList.remove('text-red-500');
      (e.target as HTMLElement).textContent = 'Edit';
    }
  };

  return (
    <div className="flex flex-wrap justify-center overflow-auto p-1">
      <div
        className="mx-2 flex space-x-1 hover:text-red-500"
        role="button"
        aria-label="delete-comment"
        onClick={handleDeleteComment}
        tabIndex={0}
      >
        <FontAwesomeIcon className="my-auto text-sm" icon={faTrashCan} />
        <div className="my-auto whitespace-nowrap">Delete</div>
      </div>
      <div
        className="mx-2 flex space-x-1 hover:text-red-500"
        role="button"
        aria-label="edit-comment"
        onClick={(e: BaseSyntheticEvent) => toggleEditCommentState(e)}
        tabIndex={0}
      >
        <FontAwesomeIcon className="my-auto text-sm" icon={faEdit} />
        <div className="my-auto whitespace-nowrap">Edit</div>
      </div>
    </div>
  );
};
export default CommentButtons;
