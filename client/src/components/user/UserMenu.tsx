import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
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
        <PopoverButton
          className="rounded-full px-1 hover:bg-slate-200 focus-visible:bg-slate-200
            focus-visible:outline-offset-2"
          ref={setReferenceElement}
          aria-label="User menu"
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </PopoverButton>
        <Transition
          enter="transition-opacity duration-150 ease-in-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100 ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <PopoverPanel
            className="absolute z-100"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div
              className="overflow-hidden rounded-md border border-gray-200 bg-white text-sm
                shadow-sm"
            >
              {DefaultMenuButtons}
              {isAuthorized && user?.id !== comment.user.id && ModerationMenuButtons}
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </>
  );
};
export default UserMenu;
