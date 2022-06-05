import { faGem } from '@fortawesome/free-regular-svg-icons';
import {
  faGem as fasGem,
  faGavel,
  faShield,
  faStar,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUserProps } from './hooks/useTooltipModerationButtons';

const Badges = (props: IUserProps) => {
  const { user } = props;

  const role = () => {
    if (user.role === 'ADMIN')
      return (
        <span className="fa-layers">
          <FontAwesomeIcon className="text-once fa-fw" icon={faShield} />
          <FontAwesomeIcon className="fa-inverse fa-fw" transform="shrink-6" icon={faStar} />
        </span>
      );

    if (user.role === 'MODERATOR')
      return (
        <span className="text-blue-600">
          <FontAwesomeIcon icon={faGavel} />
        </span>
      );

    return null;
  };

  const vip = () => {
    if (user.role === 'VIP')
      return (
        <span className="fa-layers">
          <FontAwesomeIcon className="text-green-500" transform="grow-4" icon={faSquare} />
          <FontAwesomeIcon className="fa-inverse" transform="shrink-4" icon={faGem} />
        </span>
      );

    return null;
  };

  const status = () => {
    if (user.status !== 'ACTIVE')
      return (
        <span className="text-red-500">
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
