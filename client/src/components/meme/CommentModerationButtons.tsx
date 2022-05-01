import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan as fasTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "contexts/AuthContext";
import { useEffect, useState } from "react";
import { toggleMemeComment } from "./MemeAPI";

  const CommentModerationButtons = (props: { commentId: number }) => {
    const [isActive, setActive] = useState<boolean>(true);
    const [isAuthorized, setAuthorized] = useState<boolean>(false);
    const { user } = useAuth();

    useEffect(() => {
      if (user?.role === 'MODERATOR' || user?.role === 'ADMIN') setAuthorized(true);
    }, [user?.role]);

    const handleRemoveComment = async () => {
      await toggleMemeComment(props.commentId).then((data) => {
        if (data.id) setActive(data.active);
      });
    };

    if (isAuthorized) {
      return (
        <div className="p-1 flex flex-wrap justify-center">
          <div
            className="flex hover:text-red-500 space-x-1 mx-2"
            role="button"
            aria-label="remove-comment"
            onClick={handleRemoveComment}
          >
            <FontAwesomeIcon
              className={`${!isActive && 'text-red-500'} my-auto text-sm`}
              icon={isActive ? faTrashCan : fasTrashCan}
            />
            <div className={`${!isActive && 'text-red-500'} my-auto whitespace-nowrap`}>
              {isActive ? 'Remove' : 'Removed'}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  export default CommentModerationButtons;
