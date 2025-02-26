import { memo } from 'react';
import { Link } from 'react-router';

interface NavBarLoggedOutProps {
  currentPath: string;
}

const NavBarLoggedOut = memo(({ currentPath }: NavBarLoggedOutProps) => {
  const isActive = (path: string) => currentPath === path;

  return (
    <div className="hidden items-center space-x-2 md:flex">
      <Link
        to="/login"
        className={`${isActive('/login') ? 'border-once' : 'border-transparent'} border-b-2 p-2
          font-semibold hover:border-once`}
      >
        Login
      </Link>
      <Link
        to="/register"
        className={`${isActive('/register') ? 'border-once' : 'border-transparent'} border-b-2 p-2
          font-semibold hover:border-once`}
      >
        Register
      </Link>
    </div>
  );
});

export default NavBarLoggedOut;
