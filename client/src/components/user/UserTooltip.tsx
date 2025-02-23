import {
  FloatingArrow,
  arrow,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CommentProps, IUserProps } from 'components/meme/InteractiveComments';
import { useAuth } from 'contexts/AuthContext';
import useReportCommentStore from 'hooks/useReportComment';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Badges from './Badges';
import useTooltipModerationButtons from './hooks/useTooltipModerationButtons';

export interface UserTooltipProps {
  comment: CommentProps;
}

const UserTooltip = ({ comment }: UserTooltipProps) => {
  const [commentUser, setCommentUser] = useState<IUserProps>(comment.user);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { isBanned, ModerationButtons } = useTooltipModerationButtons(comment);
  const { reportingComment } = useReportCommentStore();
  const arrowRef = useRef(null);

  const { context, floatingStyles, refs } = useFloating({
    placement: 'top-end',
    open: open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(2),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
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
  const hover = useHover(context, {
    delay: { open: 300 },
    handleClose: safePolygon(),
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover]);

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

  return (
    <div>
      <button
        className={`px-1 hover:cursor-pointer hover:underline hover:decoration-black
          hover:decoration-solid${
          isBanned
              ? 'line-through decoration-ponce-500'
              : '' }`}
        onClick={() => navigate(`/user/${comment.user.username}`)}
        ref={refs.setReference}
        role="button"
        {...getReferenceProps()}
      >
        {comment.user.displayname ? comment.user.displayname : comment.user.username}
      </button>
      {isMounted && (
        <div style={transitionStyles}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={'absolute w-fit rounded-md border border-slate-300 bg-gray-200 shadow-md'}
            {...getFloatingProps()}
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
                <div className="grid grow content-between">
                  <Badges user={commentUser} />
                  <div className="flex flex-wrap justify-between text-xs">
                    <a
                      className="text-once-900 hover:underline"
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
            <FloatingArrow
              className="fill-gray-200 [&>path:first-of-type]:stroke-slate-300
                [&>path:last-of-type]:stroke-gray-200"
              context={context}
              ref={arrowRef}
              strokeWidth={1}
              style={{ transform: 'translateY(-1px)' }}
              tipRadius={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default UserTooltip;
