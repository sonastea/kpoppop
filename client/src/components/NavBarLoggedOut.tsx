import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const NavBarLoggedOut = () => {
  const location = useLocation();
  const [path, setPath] = useState<string>(location.pathname);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="items-center hidden md:flex space-x-2">
      <a
        href="/login"
        className={`${
          path === '/login' ? 'border-once' : 'border-transparent'
        } p-2 font-semibold border-b-2 hover:border-once`}
      >
        Login
      </a>
      <a
        href="/register"
        className={`${
          path === '/register' ? 'border-once' : 'border-transparent'
        } p-2 font-semibold border-b-2 hover:border-once`}
      >
        Register
      </a>
    </div>
  );
};

export default NavBarLoggedOut;
