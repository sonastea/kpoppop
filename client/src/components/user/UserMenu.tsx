import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Transition } from '@headlessui/react';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import useUserMenuButtons from './hooks/useUserMenuButtons';
import { UserTooltipProps as UserMenuProps } from './UserTooltip';

const UserMenu = ({ comment }: UserMenuProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { DefaultMenuButtons, ModerationMenuButtons } = useUserMenuButtons({ comment });
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const { user } = useAuth();

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
            className="absolute z-100"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className="border bg-white shadow-sm border-gray-200 rounded-md text-sm overflow-hidden">
              {DefaultMenuButtons}
              {isAuthorized && user?.id !== comment.user.id && ModerationMenuButtons}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};
export default UserMenu;
