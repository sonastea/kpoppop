import { Popover, Transition } from '@headlessui/react';
import { CommentProps } from 'components/meme/InteractiveComments';
import { useState } from 'react';
import { usePopper } from 'react-popper';

export interface UserTooltipProps {
  comment: CommentProps;
}

const UserTooltip = ({ comment }: UserTooltipProps) => {
  const [isShowing, setIsShowing] = useState(false);
  const [delayHandler, setDelayHandler] = useState<number>();
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
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
          className="hover:underline px-1"
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
          <div className="mix-blend-color" id="arrow" ref={setArrowElement} style={styles.arrow} />
          <a className="contents" href={comment.user.photo && comment.user.photo}>
            <img
              className="h-16 rounded-full"
              src={
                comment.user.photo ? comment.user.photo : '/images/default_photo_white_200x200.png'
              }
              alt={`${comment.user.username} profile`}
            />
          </a>
          <a
            className={`${!isShowing ? 'duration-150 scale-75 transform' : ''}`}
            href={`/user/${comment.user.username}`}
          >
            {comment.user.username}
          </a>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
export default UserTooltip;
