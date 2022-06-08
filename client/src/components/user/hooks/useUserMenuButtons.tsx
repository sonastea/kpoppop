import { faFlag, faFrown } from '@fortawesome/free-regular-svg-icons';
import { faBan, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUserProps } from 'components/meme/InteractiveComments';
import useReportUserStore from 'hooks/useReportUser';
import { useEffect, useState } from 'react';
import { banUser, modUser, unbanUser, unmodUser } from '../UserAPI';

const useUserMenuButtons = (props: { user: IUserProps }) => {
  const [isBanned, setBanned] = useState<boolean>(props.user.status === 'BANNED' && true);
  const [isModded, setModded] = useState<boolean>(false);
  const { isReporting } = useReportUserStore();

  const button_bg = 'grid grid-flow-col auto-cols-max gap-x-2 p-2 py-1 hover:bg-gray-200';

  useEffect(() => {
    if (props.user.role === 'MODERATOR' || props.user.role === 'ADMIN') setModded(true);
  }, [props.user.role]);

  const handleBanUser = async () => {
    await banUser(undefined, props.user.id).then((data) => {
      if (data.id) setBanned(true);
      else alert('An error occurred.');
    });
  };

  const handleUnbanUser = async () => {
    await unbanUser(undefined, props.user.id).then((data) => {
      if (data.id) setBanned(false);
      else alert('An error occurred.');
    });
  };

  const handleModUser = async () => {
    await modUser(undefined, props.user.id).then((data) => {
      if (data.id) setModded(true);
      else alert('An error occurred.');
    });
  };

  const handleUnmodUser = async () => {
    await unmodUser(undefined, props.user.id).then((data) => {
      if (data.id) setModded(false);
      else alert('An error occurred.');
    });
  };

  return {
    DefaultMenuButtons: (
      <>
        <div className={button_bg} role="button" aria-label="report-user" onClick={isReporting}>
          <span>
            <FontAwesomeIcon className="text-red-500" icon={faFrown} />
          </span>
          <span className="hover:bg-gray-200 whitespace-nowrap">Report @{props.user.username}</span>
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
          >
            <span>
              <FontAwesomeIcon className="text-red-600" icon={faBan} />
            </span>
            <span className="hover:bg-gray-200 whitespace-nowrap">Unban</span>
          </div>
        ) : (
          <div className={button_bg} role="button" aria-label="ban-user" onClick={handleBanUser}>
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
          >
            <span className="fa-layers my-auto">
              <FontAwesomeIcon className="text-red-600" icon={faBan} />
              <FontAwesomeIcon size="xs" icon={faGavel} />
            </span>
            <span className="whitespace-nowrap">Unmod</span>
          </div>
        ) : (
          <div className={button_bg} role="button" aria-label="mod-user" onClick={handleModUser}>
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
