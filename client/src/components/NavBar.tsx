import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useLocation } from 'react-router';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const { user, logout } = useAuth();
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
          'px-2 py-2 font-semibold text-slate-900 border-b-2 border-transparent duration-150 hover:border-once',
      },
      {
        id: 2,
        name: 'Contact',
        to: '/contact',
        className:
          'px-2 py-2 font-semibold text-slate-900 border-b-2 border-transparent duration-150 hover:border-once',
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

  return (
    <nav className="relative w-full shadow">
      <div className="mx-auto md:max-w-screen-2xl">
        <div className="flex justify-between flex-wrap overflow-hidden md:overflow-visible">
          <div className="flex flex-shrink-0 space-x-2">
            <a href="/" className="flex items-center m-2">
              <img
                src="/images/header_logo.png"
                alt="Kpoppop Logo"
                className="grow-0 w-auto h-10 sm:h-16"
              />
            </a>

            <ul className="items-center hidden md:flex space-x-1">
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

          {user?.username ? <NavBarLoggedIn /> : <NavBarLoggedOut />}

          <div className="flex flex-wrap items-center m-2 md:hidden">
            {user?.username && <span className="font-semibold text-once-900">{user.username}</span>}
            <button
              aria-label="Mobile menu toggle"
              className="mobile-menu-toggle"
              onClick={() => setMobileNav((prev) => !prev)}
            >
              <svg
                className={`${isActiveMobileNav && 'bg-once-200 rounded-xl'} w-8 h-8 ml-1`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div
            id="mobileNav"
            className={`${
              !isActiveMobileNav && '-translate-x-full'
            } w-64 flex flex-col min-h-screen md:hidden rounded absolute pr-3 bg-gray-200 z-100 transform duration-300 ease-in-out left-0`}
          >
            <div className="pt-8 pl-4">
              <a className="inline-block" href="/">
                <img
                  src="/images/header_logo.png"
                  alt="Kpoppop Logo"
                  className="w-5/6 h-auto"
                ></img>
              </a>
              <button
                className="absolute right-4"
                aria-label="Toggle mobile nav"
                onClick={() => setMobileNav((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="pt-8 pb-48 pl-4 pr-16">
              <div className="flex flex-col space-y-3">
                {user?.username ? (
                  <>
                    <a className="hover:text-once-500" href="/memes">
                      Memes
                    </a>
                    <a className="hover:text-once-500" href="/messages">
                      Messages
                    </a>
                    <a className="hover:text-once-500" href={`/user/${user?.username}`}>
                      Profile
                    </a>
                    <a className="hover:text-once-500" href={`/profile/settings`}>
                      Settings
                    </a>
                    <button className="flex hover:text-once-500" onClick={logout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/memes">Memes</a>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
