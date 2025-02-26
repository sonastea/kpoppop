import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { toast } from 'react-toastify/unstyled';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';
import useUploadMeme from './meme/hooks/useUploadMeme';

const NavBar = () => {
  const { user, logout } = useAuth();
  const { setShowUploadMeme } = useUploadMeme();
  const location = useLocation();
  const [isActiveMobileNav, setMobileNav] = useState<boolean>(false);
  const [active, setActive] = useState<number>();

  const username = useMemo(() => user?.username, [user?.username]);

  const setNavItem = (id: number) => {
    setActive(id);
    setMobileNav(false);
  };

  const toggleUploadMemeModal = () => {
    if (!user) {
      toast.error('You must be logged in to upload.');
      return;
    }

    if (location.pathname === '/' || location.pathname === '/memes') {
      setShowUploadMeme();
      setMobileNav(false);
    }
  };

  const navItems = useMemo(
    () => [
      {
        id: 1,
        name: 'Home',
        to: '/',
        className: 'p-2 font-semibold text-slate-900 border-b-2 duration-150 hover:border-once',
      },
      {
        id: 2,
        name: 'Contact',
        to: '/contact',
        className: 'p-2 font-semibold text-slate-900 border-b-2 duration-150 hover:border-once',
      },
      {
        id: 3,
        name: 'Upload',
        to: 'button',
        className: 'p-2 font-semibold text-slate-900 border-b-2 duration-150 hover:border-once',
      },
    ],
    []
  );

  const mobileNavItemsLoggedOutClassName = 'hover:underline p-2';
  const mobileNavItemsLoggedOut = useMemo(
    () => [
      {
        id: 1,
        name: 'Home',
        to: '/',
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
        name: 'Home',
        to: '/',
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

  const navigationComponent = useMemo(() => {
    if (username) {
      return <NavBarLoggedIn username={username} logout={logout} />;
    }

    return <NavBarLoggedOut currentPath={location.pathname} />;
  }, [username, logout, location.pathname]);

  useEffect(() => {
    mobileNavItemsLoggedIn.forEach((item) => {
      if (user && location.pathname === item.to) {
        setActive(item.id);
      }
    });

    mobileNavItemsLoggedOut.forEach((item) => {
      if (!user && location.pathname === item.to) {
        setActive(item.id);
      }
    });
  }, [location.pathname, mobileNavItemsLoggedIn, mobileNavItemsLoggedOut]);

  useEffect(() => {
    if (isActiveMobileNav) {
      document.body.classList.add('fixed');
    } else {
      document.body.classList.remove('fixed');
    }
  }, [isActiveMobileNav]);

  return (
    <nav className="fixed z-10 w-full bg-white shadow-md">
      <div className="md:max-w-(--breakpoint-2xl) mx-auto">
        <div className="flex flex-wrap justify-between overflow-hidden md:overflow-visible">
          <div className="flex shrink-0 space-x-2">
            <Link
              aria-label="Home"
              className="aspect-w-2 aspect-h-1 m-2 flex h-10 grow-0 items-center sm:h-16"
              reloadDocument
              to="/"
              onClick={() => setNavItem(1)}
            >
              <img
                src="/images/header_logo.png"
                alt="Kpoppop Logo"
                className="h-full w-16 object-contain md:w-24"
              />
            </Link>

            <ul className="hidden items-center space-x-1 md:flex">
              {navItems.map((item) => {
                if (item.to === 'button') {
                  return (
                    <li key={item.id}>
                      <Link
                        role="button"
                        className={`${ !['/', '/memes'].includes(location.pathname) &&
                        'cursor-not-allowed border-none text-slate-900/50' } ${item.className}
                        border-transparent`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleUploadMemeModal();
                        }}
                        to=" "
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <Link
                      to={`${item.to}`}
                      className={`${item.className} ${
                      active === item.id ? 'border-once' : 'border-transparent' }`}
                      onClick={() => setNavItem(item.id)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {navigationComponent}

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
            className={`${isActiveMobileNav ? 'flex' : 'hidden'} fixed z-50 h-screen w-screen
              bg-transparent backdrop-brightness-50 duration-150 md:hidden`}
            onClick={() => setMobileNav((prev) => !prev)}
            aria-label="Toggle mobile nav"
          />

          <div
            id="mobileNav"
            className={`${!isActiveMobileNav && 'translate-x-full duration-100'} fixed right-0 z-100
              h-screen w-3/4 transform overflow-auto rounded-l bg-white py-6 pl-6 pr-10 shadow-md
              duration-300 ease-in-out sm:w-64 md:hidden`}
          >
            <Link
              className="aspect-w-2 aspect-h-1 inline-block w-32 sm:w-48"
              aria-label="Home"
              to="/"
            >
              <img
                className="h-full w-full object-contain"
                src="/images/header_logo.png"
                alt="Kpoppop Logo"
              />
            </Link>
            <div>
              <button
                className="absolute right-4 top-4 sm:right-6 sm:top-7"
                aria-label="Toggle mobile nav"
                onClick={() => setMobileNav((prev) => !prev)}
              >
                <FontAwesomeIcon className="text-2xl" icon={faXmark} />
              </button>
            </div>
            <div className="divider mb-4 mt-6 h-px w-full bg-gray-300/80" />
            <nav className="flex flex-col overflow-hidden overflow-x-auto">
              {user?.username ? (
                <>
                  {mobileNavItemsLoggedIn.map((item) => {
                    return (
                      <Link
                        to={`${item.to}`}
                        className={`${
                          active === item.id
                            ? 'rounded-md bg-slate-200/80 font-semibold text-thrice'
                            : 'bg-transparent'
                            } ${item.className}`}
                        onClick={() => setNavItem(item.id)}
                        key={item.id}
                        reloadDocument={item.to === '/'}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                  <button
                    className="flex p-2 hover:underline"
                    aria-label="Upload"
                    onClick={() => toggleUploadMemeModal()}
                  >
                    Upload
                  </button>
                  <button className="flex p-2 hover:underline" aria-label="Logout" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {mobileNavItemsLoggedOut.map((item) => {
                    return (
                      <Link
                        to={`${item.to}`}
                        className={`${
                          active === item.id
                            ? 'rounded-md bg-gray-200/60 text-thrice'
                            : 'bg-transparent'
                        } ${item.className}`}
                        onClick={() => setNavItem(item.id)}
                        key={item.id}
                        reloadDocument={item.to === '/'}
                      >
                        {item.name}
                      </Link>
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
