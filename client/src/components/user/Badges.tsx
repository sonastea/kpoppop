import { faGem } from '@fortawesome/free-regular-svg-icons';
import { faGavel, faShield, faSquare, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUserProps } from 'components/meme/InteractiveComments';
import { useState } from 'react';

interface IRoleTooltipProps {
  children: React.ReactNode;
  tooltipText: string;
}

const RoleTooltip = ({ children, tooltipText }: IRoleTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLongPressStart = () => {
    setShowTooltip(true);
  };

  const handleLongPressEnd = () => {
    setShowTooltip(false);
  };

  return (
    <span
      className="relative"
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onTouchCancel={handleLongPressEnd}
      onMouseOver={handleLongPressStart}
      onMouseLeave={handleLongPressEnd}
    >
      {children}
      {showTooltip && (
        <span
          className="absolute left-0 top-6 z-100 rounded bg-zinc-800 p-1 text-sm text-gray-100
            shadow"
        >
          {tooltipText}
        </span>
      )}
    </span>
  );
};

const Badges = (props: { user: IUserProps }) => {
  const { user } = props;

  const role = () => {
    if (user.role === 'ADMIN')
      return (
        <RoleTooltip tooltipText="Admin">
          <span className="fa-layers">
            <FontAwesomeIcon className="fa-fw text-once" icon={faShield} />
            <FontAwesomeIcon className="fa-inverse fa-fw" transform="shrink-6" icon={faStar} />
          </span>
        </RoleTooltip>
      );

    if (user.role === 'MODERATOR')
      return (
        <RoleTooltip tooltipText="Moderator">
          <span className="text-blue-600">
            <FontAwesomeIcon icon={faGavel} />
          </span>
        </RoleTooltip>
      );

    return null;
  };

  const vip = () => {
    if (user.role === 'VIP')
      return (
        <RoleTooltip tooltipText="VIP">
          <span className="fa-layers">
            <FontAwesomeIcon className="text-green-500" transform="grow-4" icon={faSquare} />
            <FontAwesomeIcon className="fa-inverse" transform="shrink-4" icon={faGem} />
          </span>
        </RoleTooltip>
      );

    return null;
  };

  const status = () => {
    if (user.status !== 'ACTIVE')
      return (
        <span className="text-red-500" title={user.status}>
          {(user.status === 'BANNED' && 'BANNED') || (user.status === 'SUSPENDED' && 'SUSPENDED')}
        </span>
      );

    return null;
  };

  return (
    <div className="grid grid-rows-3">
      <span className="badge-bar space-x-1">
        {role()}
        {vip()}
      </span>
      {status()}
    </div>
  );
};

export default Badges;
