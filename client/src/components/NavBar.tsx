import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isActiveMobileNav, setMobileNav] = useState<boolean>(false);
  const [active, setActive] = useState<number>();

  const navItems = useMemo(
    () => [
      {
        id: 1,
        name: 'Memes',
        to: '/memes',
        className:
          'px-2 py-2 font-semibold text-slate-900 border-b-2 duration-150 hover:border-once',
      },
      {
        id: 2,
        name: 'Contact',
        to: '/contact',
        className:
          'px-2 py-2 font-semibold text-slate-900 border-b-2 duration-150 hover:border-once',
      },
    ],
    []
  );

  const mobileNavItemsLoggedOutClassName = 'hover:underline p-2';
  const mobileNavItemsLoggedOut = useMemo(
    () => [
      {
        id: 1,
        name: 'Memes',
        to: '/memes',
        className: mobileNavItemsLoggedOutClassName,
      },
      {
        id: 2,
        name: 'Contact',
        to: '/contact',
        className: mobileNavItemsLoggedOutClassName,
      },
      {
        id: 3,
        name: 'Login',
        to: '/login',
        className: mobileNavItemsLoggedOutClassName,
      },
      {
        id: 4,
        name: 'Register',
        to: '/register',
        className: mobileNavItemsLoggedOutClassName,
      },
    ],
    []
  );

  const mobileNavItemsLoggedInClassName = 'hover:underline p-2';
  const mobileNavItemsLoggedIn = useMemo(
    () => [
      {
        id: 1,
        name: 'Memes',
        to: '/memes',
        className: mobileNavItemsLoggedInClassName,
      },
      {
        id: 3,
        name: 'Messages',
        to: '/messages',
        className: mobileNavItemsLoggedInClassName,
      },
      {
        id: 4,
        name: 'Profile',
        to: `/user/${user?.username}`,
        className: mobileNavItemsLoggedInClassName,
      },
      {
        id: 5,
        name: 'Settings',
        to: '/profile/settings',
        className: mobileNavItemsLoggedInClassName,
      },
      {
        id: 2,
        name: 'Contact',
        to: '/contact',
        className: mobileNavItemsLoggedInClassName,
      },
    ],
    [user?.username]
  );

  useEffect(() => {
    mobileNavItemsLoggedIn.forEach((item) => {
      if (location.pathname === item.to) {
        setActive(item.id);
      }
    });

    mobileNavItemsLoggedOut.forEach((item) => {
      if (location.pathname === item.to) {
        setActive(item.id);
      }
    });
  }, [location.pathname, mobileNavItemsLoggedIn, mobileNavItemsLoggedOut]);

  useEffect(() => {
    if (isActiveMobileNav) {
      document.body.classList.add('fixed');
      document.body.classList.add('w-full');
    } else {
      document.body.classList.remove('fixed');
      document.body.classList.remove('w-full');
    }
  }, [isActiveMobileNav]);

  return (
    <nav className="relative w-full shadow-md">
      <div className="mx-auto md:max-w-screen-2xl">
        <div className="flex flex-wrap justify-between overflow-hidden md:overflow-visible">
          <div className="flex flex-shrink-0 space-x-2">
            <a href="/" className="aspect-w-2 aspect-h-1 m-2 flex h-10 grow-0 items-center sm:h-16">
              <img
                src="/images/header_logo.png"
                alt="Kpoppop Logo"
                className="h-full w-full object-contain"
              />
            </a>

            <ul className="hidden items-center space-x-1 md:flex">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`${item.to}`}
                    className={`${item.className} ${
                      active === item.id ? 'border-once' : 'border-transparent'
                    }`}
                    onClick={() => setActive(item.id)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {user?.username ? <NavBarLoggedIn /> : <NavBarLoggedOut />}

          <div className="m-2 flex flex-wrap items-center md:hidden">
            {user?.username && <span className="font-semibold text-once-900">{user.username}</span>}
            <button
              aria-label="Mobile menu toggle"
              className="mobile-menu-toggle"
              onClick={() => setMobileNav((prev) => !prev)}
            >
              <svg
                className={`${isActiveMobileNav && 'rounded-xl bg-once-200'} ml-1 h-8 w-8`}
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
            className={`${!isActiveMobileNav && 'translate-x-full'} fixed right-0 z-50 h-screen
            w-screen transform bg-transparent backdrop-brightness-50 ease-in-out md:hidden`}
            onClick={() => setMobileNav((prev) => !prev)}
          />

          <div
            id="mobileNav"
            className={`${!isActiveMobileNav && 'translate-x-full'} fixed right-0 z-100 h-screen
            w-3/4 transform overflow-auto rounded-l bg-white py-6 pl-6 pr-10 shadow-md duration-300
            ease-in-out sm:w-64 md:hidden`}
          >
            <a
              className="aspect-w-2 aspect-h-1 inline-block w-32 sm:w-48"
              aria-label="Home"
              href="/"
            >
              <img
                className="h-full w-full object-contain"
                src="/images/header_logo.png"
                alt="Kpoppop Logo"
              />
            </a>
            <div>
              <button
                className="absolute right-4 top-4 px-2 py-1"
                aria-label="Toggle mobile nav"
                onClick={() => setMobileNav((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="divider mb-4 mt-6 h-px w-full bg-gray-300/80" />
            <nav className="flex flex-col overflow-hidden overflow-x-auto">
              {user?.username ? (
                <>
                  {mobileNavItemsLoggedIn.map((item) => {
                    return (
                      <a
                        href={`${item.to}`}
                        className={`${
                          active === item.id
                            ? 'rounded-md bg-gray-200/60 text-thrice'
                            : 'bg-transparent'
                        } ${item.className}`}
                        onClick={() => setActive(item.id)}
                        key={item.id}
                      >
                        {item.name}
                      </a>
                    );
                  })}
                  <button className="flex p-2 hover:underline" aria-label="Logout" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {mobileNavItemsLoggedOut.map((item) => {
                    return (
                      <a
                        href={`${item.to}`}
                        className={`${
                          active === item.id
                            ? 'rounded-md bg-gray-200/60 text-thrice'
                            : 'bg-transparent'
                        } ${item.className}`}
                        onClick={() => setActive(item.id)}
                        key={item.id}
                      >
                        {item.name}
                      </a>
                    );
                  })}
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
