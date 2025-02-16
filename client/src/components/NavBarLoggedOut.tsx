import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBarLoggedOut = () => {
  const location = useLocation();
  const [path, setPath] = useState<string>(location.pathname);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="hidden items-center space-x-2 md:flex">
      <Link
        to="/login"
        className={`${path === '/login' ? 'border-once' : 'border-transparent'} border-b-2 p-2
          font-semibold hover:border-once`}
      >
        Login
      </Link>
      <Link
        to="/register"
        className={`${path === '/register' ? 'border-once' : 'border-transparent'} border-b-2 p-2
          font-semibold hover:border-once`}
      >
        Register
      </Link>
    </div>
  );
};

export default NavBarLoggedOut;
