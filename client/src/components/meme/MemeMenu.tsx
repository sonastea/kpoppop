import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Transition } from '@headlessui/react';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import useMemeMenuButtons from './hooks/useMemeMenuButtons';

const MemeMenu = ({ authorId, memeId }: { authorId: number; memeId: number }) => {
  const { user } = useAuth();
  const { DefaultMenuButtons, LoggedInMenuButtons, ModerationMenuButtons } = useMemeMenuButtons(
    user?.id ?? false,
    memeId
  );
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const isAuthor = user?.id === authorId;

  useEffect(() => {
    if (user?.role === 'MODERATOR' || user?.role === 'ADMIN') setAuthorized(true);
  }, [user?.role]);

  styles.popper = {
    ...styles.popper,
    position: 'absolute',
    inset: '-30px auto auto -20px',
  };

  return (
    <>
      <Popover>
        <Popover.Button
          className="-p-2 group outline-none"
          ref={setReferenceElement}
          aria-label="Toggle user menu"
        >
          <FontAwesomeIcon
            className="group-hover:bg-gray-200/75 group-hover:rounded-full p-1"
            icon={faEllipsis}
          />
        </Popover.Button>
        <Transition
          enter="transition-opacity duration-150 ease-in-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100 ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel
            className="absolute z-100"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className="border bg-white shadow-sm border-gray-200 rounded-md text-sm overflow-hidden">
              {isAuthor && LoggedInMenuButtons}
              {DefaultMenuButtons}
              {isAuthorized && !isAuthor && ModerationMenuButtons}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default MemeMenu;
