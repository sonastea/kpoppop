import { faBan, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { banUser, modUser, unbanUser, unmodUser } from '../UserAPI';

export type TooltipModerationProps = {
  user: {
    banner?: string;
    displayname?: string;
    id: number;
    photo?: string;
    role: string;
    username: string;
    status: string;
  };
};

const useTooltipModerationButtons = (props: TooltipModerationProps) => {
  const [isBanned, setBanned] = useState<boolean>(props.user.status === 'BANNED' && true);
  const [isModded, setModded] = useState<boolean>(false);

  useEffect(() => {
    if (props.user.role === 'MODERATOR' || props.user.role === 'ADMIN') setModded(true);
  }, [props.user.role]);

  const handleBanUser = async () => {
    await banUser(props.user.id).then((data) => {
      if (data.id) setBanned(true);
    });
  };

  const handleUnbanUser = async () => {
    await unbanUser(props.user.id).then((data) => {
      if (data.id) setBanned(false);
    });
  };

  const handleModUser = async () => {
    await modUser(props.user.id).then((data) => {
      if (data.id) setModded(true);
    });
  };

  const handleUnmodUser = async () => {
    await unmodUser(props.user.id).then((data) => {
      if (data.id) setModded(false);
    });
  };

  return {
    isBanned,
    ModerationButtons: (
      <div className="p-1 flex flex-wrap justify-evenly">
        {isBanned ? (
          <div
            className="flex flex-wrap space-x-1 mx-2"
            role="button"
            aria-label="unban-user"
            onClick={handleUnbanUser}
          >
            <span>
              <FontAwesomeIcon className="text-green-600" icon={faBan} />
            </span>
            <span className="hover:text-green-600 whitespace-nowrap">Unban</span>
          </div>
        ) : (
          <div
            className="flex space-x-1 mx-2"
            role="button"
            aria-label="ban-user"
            onClick={handleBanUser}
          >
            <span>
              <FontAwesomeIcon className="text-red-500" icon={faBan} />
            </span>
            <span className="hover:text-red-500 whitespace-nowrap">Ban</span>
          </div>
        )}
        {isModded ? (
          <div
            className="flex space-x-1 mx-2"
            role="button"
            aria-label="unmod-user"
            onClick={handleUnmodUser}
          >
            <span className="fa-layers my-auto">
              <FontAwesomeIcon className="text-red-600" icon={faBan} />
              <FontAwesomeIcon size="xs" icon={faGavel} />
            </span>
            <span className="hover:text-red-600 whitespace-nowrap">Unmod</span>
          </div>
        ) : (
          <div
            className="flex space-x-1 mx-2"
            role="button"
            aria-label="mod-user"
            onClick={handleModUser}
          >
            <span>
              <FontAwesomeIcon className="text-once-500" icon={faGavel} />
            </span>
            <span className="hover:text-once-500 whitespace-nowrap">Mod</span>
          </div>
        )}
      </div>
    ),
  };
};
export default useTooltipModerationButtons;
