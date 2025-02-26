import {
  faAngleDown,
  faAnglesDown,
  faArrowRightFromBracket,
  faGears,
  faMessage,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { memo, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

interface NavBarLoggedInProps {
  username: string;
  logout: () => void;
}

const NavBarLoggedIn = memo(({ username, logout }: NavBarLoggedInProps) => {
  const location = useLocation();
  const [path, setPath] = useState<string>(location.pathname);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  const logoutHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    logout();
  };

  return (
    <Menu as="div" className="relative hidden md:block">
      {({ open }) => (
        <>
          <MenuButton
            className="inline-flex h-full items-center p-2 font-semibold text-once-900
              hover:bg-once-200"
          >
            {username}
            {open ? (
              <FontAwesomeIcon className="ml-2 text-slate-900" icon={faAnglesDown} />
            ) : (
              <FontAwesomeIcon className="ml-2 text-slate-700" icon={faAngleDown} />
            )}
          </MenuButton>
          {open && (
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-900 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <MenuItems
                className="focus:outline-hidden absolute right-0 z-50 m-2 w-40 rounded-md border
                  bg-white shadow-md ring-opacity-5"
              >
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      className={`flex items-center px-4 py-2 text-sm ${ focus &&
                      'rounded-t-md bg-once-200' } ${
                      path === `/user/${username}`
                          ? 'rounded-tr-md border-r-2 border-r-once'
                          : 'border-none'
                      }`}
                      to={`/user/${username}`}
                    >
                      <FontAwesomeIcon viewBox="0 0 512 512" className="mr-3" icon={faUser} />
                      Profile
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      className={`flex items-center px-4 py-2 text-sm ${focus && 'bg-once-200'} ${
                      path === '/messages' ? 'border-r-2 border-r-once' : 'border-none' }`}
                      to={`/messages`}
                    >
                      <FontAwesomeIcon viewBox="0 0 512 512" className="mr-3" icon={faMessage} />
                      Messages
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      className={`flex items-center px-4 py-2 text-sm ${focus && 'bg-once-200'} ${
                      path === '/profile/settings' ? 'border-r-2 border-r-once' : 'border-none' }`}
                      to={`/profile/settings`}
                    >
                      <FontAwesomeIcon viewBox="0 0 512 512" className="mr-3" icon={faGears} />
                      Settings
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={`flex w-full items-center border-t px-4 py-2 text-sm ${ focus &&
                      'rounded-b-md bg-once-200' }`}
                      onClick={logoutHandler}
                    >
                      <FontAwesomeIcon
                        viewBox="0 0 512 512"
                        className="mr-3"
                        icon={faArrowRightFromBracket}
                      />
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          )}
        </>
      )}
    </Menu>
  );
});

export default NavBarLoggedIn;
