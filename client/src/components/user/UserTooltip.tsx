import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
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

  let touchTimer: NodeJS.Timeout | undefined;

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

  const handleReport = () => {
    reportingComment(comment.id);
  };

  const handleMouseEnter = () => {
    setDelayHandler(
      window.setTimeout(() => {
        setIsShowing(true);
      }, 300)
    );
  };

  const handleMouseLeave = () => {
    clearTimeout(delayHandler);
    setIsShowing(false);
  };

  const handleTouchStart = () => {
    touchTimer = setTimeout(() => {
      setIsShowing(true);
    }, 300);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimer);
  };

  return (
    <Popover>
      <PopoverButton
        className={`px-1 hover:cursor-pointer hover:underline hover:decoration-black
        hover:decoration-solid ${isBanned && 'line-through decoration-ponce-500'}`}
        ref={setReferenceElement}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => (window.location.href = `/user/${comment.user.username}`)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {comment.user.displayname ? comment.user.displayname : comment.user.username}
      </PopoverButton>
      <Transition
        show={isShowing}
        enter="transition-opacity duration-75 "
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <PopoverPanel
          className="w-fit rounded-md border border-slate-300 bg-gray-200 shadow-md"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          onMouseEnter={() => setIsShowing(true)}
          onMouseLeave={() => setIsShowing(false)}
        >
          <div className="tooltip-contents w-[75vw] divide-y divide-slate-300 md:w-[35vw]">
            <div className="tooltip-contents flex flex-wrap gap-2 p-2">
              <a className="tooltip-image" href={comment.user.photo && comment.user.photo}>
                <picture>
                  <img
                    className="h-16 w-16 rounded-full"
                    src={
                      comment.user.photo
                        ? `${comment.user.photo}?tr=w-72,h-72`
                        : '/images/default_photo_white_200x200.png'
                    }
                    alt={`${comment.user.username} profile pic`}
                  />
                </picture>
              </a>
              <div
                className={`${!isShowing && 'scale-75 transform duration-150'} grid grow
                content-between`}
              >
                <Badges user={commentUser} />
                <div className="flex flex-wrap justify-between text-xs">
                  <a
                    className={`${
                      !isShowing ? 'scale-75 transform duration-150' : 'hover:underline'
                    } text-once-900`}
                    href={`/user/${comment.user.username}`}
                  >
                    {comment.user.username}
                  </a>
                  <span className="text-black">
                    {new Date(comment.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-evenly p-1">
              <div
                className="mx-2 flex flex-wrap space-x-1"
                role="button"
                aria-label="report-user"
                onClick={handleReport}
              >
                <span>
                  <FontAwesomeIcon className="text-red-500" icon={faFlag} transform="flip" />
                </span>
                <span className="whitespace-nowrap text-black hover:text-red-500">Report</span>
              </div>
              {isAuthorized && user?.id !== comment.user.id && ModerationButtons}
            </div>
          </div>
          <div id="arrow" ref={setArrowElement} style={styles.arrow} />
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};
export default UserTooltip;
