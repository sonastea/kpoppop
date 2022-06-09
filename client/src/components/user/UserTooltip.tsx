import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Transition } from '@headlessui/react';
import { CommentProps, IUserProps } from 'components/meme/InteractiveComments';
import { useAuth } from 'contexts/AuthContext';
import useReportCommentStore from 'hooks/useReportComment';
import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import Badges from './Badges';
import useTooltipModerationButtons from './hooks/useTooltipModerationButtons';

export interface UserTooltipProps {
  comment: CommentProps;
}

const UserTooltip = ({ comment }: UserTooltipProps) => {
  const [commentUser, setCommentUser] = useState<IUserProps>(comment.user);
  const [isShowing, setIsShowing] = useState(false);
  const [delayHandler, setDelayHandler] = useState<number>();
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const { isBanned, ModerationButtons } = useTooltipModerationButtons(comment);
  const { reportingComment } = useReportCommentStore();
  const { user } = useAuth();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'right',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
      {
        name: 'flip',
        options: { fallbackPlacements: ['top', 'left', 'bottom'] },
      },
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
    ],
  });

  useEffect(() => {
    if (isBanned) {
      setCommentUser((prev) => ({
        ...prev,
        status: 'BANNED',
      }));
    } else {
      setCommentUser((prev) => ({
        ...prev,
        status: 'ACTIVE',
      }));
    }
  }, [isBanned]);

  useEffect(() => {
    if (user?.role === 'MODERATOR' || user?.role === 'ADMIN') setAuthorized(true);
  }, [user?.role]);

  const handleMouseEnter = () => {
    setDelayHandler(
      window.setTimeout(() => {
        setIsShowing(true);
      }, 500)
    );
  };

  const handleMouseLeave = () => {
    clearTimeout(delayHandler);
    setIsShowing(false);
  };

  return (
    <Popover className="relative z-100">
      <Popover.Button
        as="a"
        className={`hover:underline hover:decoration-black hover:decoration-solid hover:cursor-pointer px-1 ${
          isBanned && 'decoration-ponce-500 line-through'
        }`}
        ref={setReferenceElement}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => (window.location.href = `/user/${comment.user.username}`)}
      >
        {comment.user.displayname ? comment.user.displayname : comment.user.username}
      </Popover.Button>
      <Transition
        show={isShowing}
        enter="transition-opacity duration-75 "
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
      >
        <Popover.Panel
          className="w-fit border border-slate-300 bg-gray-200 rounded-md shadow-md"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="w-[75vw] md:w-[35vw] tooltip-contents divide-y divide-slate-300">
            <div className="tooltip-contents p-2 flex flex-wrap gap-2">
              <a className="tooltip-image" href={comment.user.photo && comment.user.photo}>
                <img
                  className="h-16 rounded-full"
                  src={
                    comment.user.photo
                      ? comment.user.photo
                      : '/images/default_photo_white_200x200.png'
                  }
                  alt={`${comment.user.username} profile`}
                />
              </a>
              <div
                className={`${
                  !isShowing && 'duration-150 scale-75 transform'
                } grid grow content-between`}
              >
                <Badges user={commentUser} />
                <div className="flex flex-wrap justify-between text-xs">
                  <a
                    className={`${
                      !isShowing ? 'duration-150 scale-75 transform' : 'hover:underline'
                    } text-once-900`}
                    href={`/user/${comment.user.username}`}
                  >
                    {comment.user.username}
                  </a>
                  <span>{new Date(comment.user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="p-1 flex flex-wrap justify-evenly">
              <div
                className="flex flex-wrap space-x-1 mx-2"
                role="button"
                aria-label="report-user"
                onClick={() => reportingComment(comment.id)}
              >
                <span>
                  <FontAwesomeIcon className="text-red-500" icon={faFlag} transform="flip" />
                </span>
                <span className="hover:text-red-500 whitespace-nowrap">Report</span>
              </div>
              {isAuthorized && user?.id !== comment.user.id && ModerationButtons}
            </div>
          </div>
          <div id="arrow" ref={setArrowElement} style={styles.arrow} />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
export default UserTooltip;
