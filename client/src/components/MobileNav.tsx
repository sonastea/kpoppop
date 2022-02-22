import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

type MobileNavProps = {
  isActive: boolean;
};

const MobileNav = ({ isActive }: MobileNavProps) => {
  const { user, logout } = useAuth();

  const logoutHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    logout();
  };

  return (
    <div
      id="mobileNav"
      className={`${
        !isActive && '-translate-x-full'
      } rounded absolute right-0 pr-3 md:hidden bg-white z-10 w-64 transform md:relative md:translate-x-0 duration-200 ease-in-out`}
    >
      <div>
        <div>KPOPPOP</div>
        <a href="/memes">Memes</a>
      </div>
      <div>
      <button onClick={() => !isActive}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
