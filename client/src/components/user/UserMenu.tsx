import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { UserTooltipProps as UserMenuProps } from './UserTooltip';
import useUserMenuButtons from './hooks/useUserMenuButtons';

const UserMenu = ({ comment }: UserMenuProps) => {
  const { DefaultMenuButtons, ModerationMenuButtons } = useUserMenuButtons({ comment });
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const { context, refs, floatingStyles } = useFloating({
    open: open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(({ rects }) => {
        return -rects.reference.height / 2 - rects.floating.height / 2;
      }),
      flip(),
      shift({ padding: 4 }),
    ],
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
    },
    close: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
    duration: {
      open: 75,
      close: 150,
    },
  });

  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  useEffect(() => {
    if (user?.role === 'MODERATOR' || user?.role === 'ADMIN') setAuthorized(true);
  }, [user?.role]);

  return (
    <div>
      <button
        className="rounded-full px-1 hover:bg-slate-200 focus-visible:bg-slate-200
          focus-visible:outline-offset-2"
        ref={refs.setReference}
        aria-label="User menu"
        role="button"
        {...getReferenceProps()}
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      {isMounted && (
        <div style={transitionStyles}>
          <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <div
              className="overflow-hidden rounded-md border border-gray-200 bg-white text-sm
                shadow-sm"
            >
              {DefaultMenuButtons}
              {isAuthorized && user?.id !== comment.user.id && ModerationMenuButtons}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserMenu;
