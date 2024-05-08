import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import useMemeMenuButtons from './hooks/useMemeMenuButtons';
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

const MemeMenu = ({ authorId, memeId }: { authorId: number; memeId: number }) => {
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const isAuthor = user?.id === authorId;
  const { DefaultMenuButtons, LoggedInMenuButtons, ModerationMenuButtons } = useMemeMenuButtons(
    user?.id ?? false,
    memeId
  );

  const { context, refs, floatingStyles } = useFloating({
    open: open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(({ rects }) => {
        return -rects.reference.height / 2 - rects.floating.height / 2;
      }),
      flip(),
      shift(),
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
      open: 150,
      close: 100,
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
        className="group rounded-full outline-none"
        ref={refs.setReference}
        aria-label="Meme menu"
        role="button"
        {...getReferenceProps()}
      >
        <FontAwesomeIcon
          className="rounded-full p-1 group-hover:rounded-full group-hover:bg-slate-200
            group-focus-visible:rounded-full group-focus-visible:bg-slate-200
            group-focus-visible:outline"
          icon={faEllipsis}
        />
      </button>
      {isMounted && (
        <div style={transitionStyles}>
          <div
            className="absolute z-100"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div
              className="overflow-hidden rounded-md border border-gray-200 bg-white text-sm
                shadow-sm"
            >
              {isAuthor && LoggedInMenuButtons}
              {isAuthorized && !isAuthor && ModerationMenuButtons}
              {DefaultMenuButtons}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeMenu;
