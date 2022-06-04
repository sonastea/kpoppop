import { Popover, Transition } from '@headlessui/react';
import { CommentProps } from 'components/meme/InteractiveComments';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import useTooltipModerationButtons from './hooks/useTooltipModerationButtons';

export interface UserTooltipProps {
  comment: CommentProps;
}

const UserTooltip = ({ comment }: UserTooltipProps) => {
  const [isShowing, setIsShowing] = useState(false);
  const [delayHandler, setDelayHandler] = useState<number>();
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const { isBanned, ModerationButtons } = useTooltipModerationButtons(comment);
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
    <Popover className="relative">
      <Popover.Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <a
          className={`hover:underline hover:decoration-black hover:decoration-solid px-1 ${isBanned && 'decoration-ponce-500 line-through'
            }`}
          href={`/user/${comment.user.username}`}
          ref={setReferenceElement}
        >
          {comment.user.displayname ? comment.user.displayname : comment.user.username}
        </a>
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
            <div className="p-2 flex flex-wrap gap-2">
              <a className="contents" href={comment.user.photo && comment.user.photo}>
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
                className={`${!isShowing && 'duration-150 scale-75 transform'
                  } grid content-between`}
              >
                <div>Cool Badge</div>
                <a
                  className={`${!isShowing ? 'duration-150 scale-75 transform' : ''}`}
                  href={`/user/${comment.user.username}`}
                >
                  {comment.user.username}
                </a>
              </div>
            </div>
            {isAuthorized && user?.id !== comment.user.id && ModerationButtons}
          </div>
          <div id="arrow" ref={setArrowElement} style={styles.arrow} />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
export default UserTooltip;
