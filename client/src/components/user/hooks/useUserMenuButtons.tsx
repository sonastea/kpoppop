import { faFlag, faFrown } from '@fortawesome/free-regular-svg-icons';
import { faBan, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useReportCommentStore from 'hooks/useReportComment';
import useReportUserStore from 'hooks/useReportUser';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify/unstyled';
import { banUser, modUser, unbanUser, unmodUser } from '../UserAPI';
import { UserTooltipProps as UserMenuProps } from '../UserTooltip';

const useUserMenuButtons = ({ comment }: UserMenuProps) => {
  const [isBanned, setBanned] = useState<boolean>(comment.user.role === 'BANNED' && true);
  const [isModded, setModded] = useState<boolean>(false);
  const { reportingComment } = useReportCommentStore();
  const { reportingUser } = useReportUserStore();

  const button_bg =
    'grid grid-flow-col auto-cols-max gap-x-2 p-2 py-1 hover:bg-gray-200/75 \
    focus-visible:outline-offset-[-1.5px] outline-slate-800';

  useEffect(() => {
    if (comment.user.role === 'MODERATOR' || comment.user.role === 'ADMIN') setModded(true);
  }, [comment.user.role]);

  const handleBanUser = async () => {
    await banUser(undefined, comment.user.id).then((data) => {
      if (data.id) setBanned(true);
      else toast.error('An error occurred.');
    });
  };

  const handleUnbanUser = async () => {
    await unbanUser(undefined, comment.user.id).then((data) => {
      if (data.id) setBanned(false);
      else toast.error('An error occurred.');
    });
  };

  const handleModUser = async () => {
    await modUser(undefined, comment.user.id).then((data) => {
      if (data.id) setModded(true);
      else toast.error('An error occurred.');
    });
  };

  const handleUnmodUser = async () => {
    await unmodUser(undefined, comment.user.id).then((data) => {
      if (data.id) setModded(false);
      else toast.error('An error occurred.');
    });
  };

  return {
    DefaultMenuButtons: (
      <>
        <div
          className={button_bg}
          role="button"
          aria-label="report-comment"
          onClick={() => reportingComment(comment.id)}
          onKeyDown={(e) => {
            if (e.code === 'Space') reportingComment(comment.id);
          }}
          tabIndex={0}
        >
          <span>
            <FontAwesomeIcon className="text-red-500" icon={faFlag} flip="horizontal" />
          </span>
          <span className="whitespace-nowrap hover:bg-gray-200/75">Report comment</span>
        </div>
        <div
          className={button_bg}
          role="button"
          aria-label="report-user"
          onClick={reportingUser}
          onKeyDown={(e) => {
            if (e.code === 'Space') reportingUser();
          }}
          tabIndex={0}
        >
          <span>
            <FontAwesomeIcon className="text-red-500" icon={faFrown} />
          </span>
          <span className="whitespace-nowrap hover:bg-gray-200/75">
            Report @{comment.user.username}
          </span>
        </div>
      </>
    ),
    ModerationMenuButtons: (
      <>
        {isBanned ? (
          <div
            className={button_bg}
            role="button"
            aria-label="unban-user"
            onClick={handleUnbanUser}
            onKeyDown={(e) => {
              if (e.code === 'Space') handleUnbanUser();
            }}
            tabIndex={0}
          >
            <span>
              <FontAwesomeIcon className="text-red-600" icon={faBan} />
            </span>
            <span className="whitespace-nowrap hover:bg-gray-200/75">Unban</span>
          </div>
        ) : (
          <div
            className={button_bg}
            role="button"
            aria-label="ban-user"
            onClick={handleBanUser}
            onKeyDown={(e) => {
              if (e.code === 'Space') handleBanUser();
            }}
            tabIndex={0}
          >
            <span>
              <FontAwesomeIcon className="text-red-500" icon={faBan} />
            </span>
            <span className="whitespace-nowrap">Ban</span>
          </div>
        )}
        {isModded ? (
          <div
            className={button_bg}
            role="button"
            aria-label="unmod-user"
            onClick={handleUnmodUser}
            onKeyDown={(e) => {
              if (e.code === 'Space') handleUnmodUser();
            }}
            tabIndex={0}
          >
            <span className="fa-layers my-auto">
              <FontAwesomeIcon className="text-red-600" icon={faBan} />
              <FontAwesomeIcon size="xs" icon={faGavel} />
            </span>
            <span className="whitespace-nowrap">Unmod</span>
          </div>
        ) : (
          <div
            className={button_bg}
            role="button"
            aria-label="mod-user"
            onClick={handleModUser}
            onKeyDown={(e) => {
              if (e.code === 'Space') handleModUser();
            }}
            tabIndex={0}
          >
            <span>
              <FontAwesomeIcon className="text-once-500" icon={faGavel} />
            </span>
            <span className="whitespace-nowrap">Mod</span>
          </div>
        )}
      </>
    ),
  };
};
export default useUserMenuButtons;
