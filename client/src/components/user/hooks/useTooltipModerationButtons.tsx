import { faBan, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUserProps } from 'components/meme/InteractiveComments';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { banUser, modUser, unbanUser, unmodUser } from '../UserAPI';

const useTooltipModerationButtons = (props: { user: IUserProps }) => {
  const [isBanned, setBanned] = useState<boolean>(props.user.status === 'BANNED' && true);
  const [isModded, setModded] = useState<boolean>(false);

  const button_bg = 'flex flex-wrap space-x-1 mx-2';

  useEffect(() => {
    if (props.user.role === 'MODERATOR' || props.user.role === 'ADMIN') setModded(true);
  }, [props.user.role]);

  const handleBanUser = async () => {
    await banUser(undefined, props.user.id).then((data) => {
      if (data.id) setBanned(true);
      else toast.error('An error occurred.');
    });
  };

  const handleUnbanUser = async () => {
    await unbanUser(undefined, props.user.id).then((data) => {
      if (data.id) setBanned(false);
      else toast.error('An error occurred.');
    });
  };

  const handleModUser = async () => {
    await modUser(undefined, props.user.id).then((data) => {
      if (data.id) setModded(true);
      else toast.error('An error occurred.');
    });
  };

  const handleUnmodUser = async () => {
    await unmodUser(undefined, props.user.id).then((data) => {
      if (data.id) setModded(false);
      else toast.error('An error occurred.');
    });
  };

  return {
    isBanned,
    ModerationButtons: (
      <>
        {isBanned ? (
          <div
            className={button_bg}
            role="button"
            aria-label="unban-user"
            onClick={handleUnbanUser}
          >
            <span>
              <FontAwesomeIcon className="text-green-600" icon={faBan} />
            </span>
            <span className="whitespace-nowrap hover:text-green-600">Unban</span>
          </div>
        ) : (
          <div className={button_bg} role="button" aria-label="ban-user" onClick={handleBanUser}>
            <span>
              <FontAwesomeIcon className="text-red-500" icon={faBan} />
            </span>
            <span className="whitespace-nowrap hover:text-red-500">Ban</span>
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
              <FontAwesomeIcon className="text-red-500" icon={faBan} />
              <FontAwesomeIcon size="xs" icon={faGavel} />
            </span>
            <span className="whitespace-nowrap hover:text-red-500">Unmod</span>
          </div>
        ) : (
          <div className={button_bg} role="button" aria-label="mod-user" onClick={handleModUser}>
            <span>
              <FontAwesomeIcon className="text-once-500" icon={faGavel} />
            </span>
            <span className="whitespace-nowrap hover:text-once-500">Mod</span>
          </div>
        )}
      </>
    ),
  };
};
export default useTooltipModerationButtons;
