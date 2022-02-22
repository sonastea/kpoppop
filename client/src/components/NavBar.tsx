import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const { user } = useAuth();
  let location = useLocation();
  const [isActiveMobileNav, setMobileNav] = useState<boolean>(false);
  const [active, setActive] = useState<number>();

  const navItems = useMemo(
    () => [
      {
        id: 1,
        name: 'Memes',
        to: '/memes',
        className:
          'px-2 py-2 font-semibold text-slate-500 border-b-2 border-transparent duration-150 hover:border-once',
      },
      {
        id: 2,
        name: 'Contact Us',
        to: '/contact',
        className:
          'px-2 py-2 font-semibold text-slate-500 border-b-2 border-transparent duration-150 hover:border-once',
      },
    ],
    []
  );

  useEffect(() => {
    navItems.forEach((item) => {
      if (location.pathname === item.to) {
        setActive(item.id);
      }
    });
  }, [location.pathname, navItems]);

  const toggleMobileNav = () => {
    setMobileNav((prev) => !prev);
  };

  return (
    <nav className="relative bg-white shadow">
      <div className="mx-auto lg:max-w-screen-2xl">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <a href="/" className="flex items-center px-2 py-2">
              <img src="/images/logo.png" alt="Kpoppop Logo" className="w-10 h-10 mr-2"></img>
            </a>

            <ul className="items-center hidden border-b lg:flex space-x-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`${item.to}`}
                    className={`${active === item.id ? 'active' : 'inactive'} ${item.className}`}
                    onClick={() => setActive(item.id)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="items-center hidden lg:flex space-x-2">
            <a href="/login" className="px-2 py-2 font-semibold border-b-2 border-transparent hover:border-once">
              Login
            </a>
            <a
              href="/register"
              className="px-2 py-2 font-semibold border-b-2 border-transparent text-once hover:border-once"
            >
              Register
            </a>
          </div>

          <div className="flex items-center lg:hidden">
            <button className="mobile-menu-toggle" onClick={toggleMobileNav}>
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div
            id="mobileNav"
            className={`${
              !isActiveMobileNav && 'translate-x-full'
            } h-screen rounded absolute right-0 pr-3 lg:hidden bg-gray-100 z-10 w-64 transform duration-200 ease-in-out`}
          >
            <div className="pt-8 pl-4">
              <a href="/">KPOPPOP</a>
              <button className="absolute right-4" onClick={() => setMobileNav((prev) => !prev)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="pt-8 pb-48 pl-4 pr-16">
              <div className="flex flex-col space-y-3">
                <a href="/memes">Memes</a>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
