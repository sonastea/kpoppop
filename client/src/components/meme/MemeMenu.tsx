import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Transition } from '@headlessui/react';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import useMemeMenuButtons from './hooks/useMemeMenuButtons';

const MemeMenu = ({ memeId: id }: { memeId: string }) => {
  const { user } = useAuth();
  const { DefaultMenuButtons, ModerationMenuButtons } = useMemeMenuButtons(
    user ? true : false,
    id);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);

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
        <Popover.Button ref={setReferenceElement} aria-label="Toggle user menu">
          <FontAwesomeIcon icon={faEllipsis} />
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
            className="absolute z-10"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className="border bg-white shadow-sm border-gray-200 rounded-md text-sm">
              {DefaultMenuButtons}
              {isAuthorized && ModerationMenuButtons}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default MemeMenu;
