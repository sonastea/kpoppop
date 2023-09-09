import {
  faAngleDown,
  faAnglesDown,
  faArrowRightFromBracket,
  faGears,
  faMessage,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavBarLoggedIn = () => {
  const { user, logout } = useAuth();
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
          <Menu.Button className="inline-flex items-center h-full p-2 font-semibold text-once-900 hover:bg-once-200">
            {user?.username}
            {open ? (
              <FontAwesomeIcon className="ml-2 text-slate-900" icon={faAnglesDown} />
            ) : (
              <FontAwesomeIcon className="ml-2 text-slate-700" icon={faAngleDown} />
            )}
          </Menu.Button>
          {open && (
            <Transition
              className="absolute right-0 w-40 mt-2 mr-2 z-50"
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-900 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="bg-white border shadow origin-top-right rounded-md ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`flex items-center px-4 py-2 text-sm ${active && 'bg-once-200 rounded-t-md'}
                        ${
                          path === `/user/${user?.username}`
                            ? 'border-r-2 border-r-once rounded-tr-md'
                            : 'border-none'
                        } `}
                      href={`/user/${user?.username}`}
                    >
                      <FontAwesomeIcon viewBox="0 0 512 512" className="mr-3" icon={faUser} />
                      Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`flex items-center px-4 py-2 text-sm ${active && 'bg-once-200'} ${
                        path === '/messages' ? 'border-r-2 border-r-once' : 'border-none'
                      }`}
                      href={`/messages`}
                    >
                      <FontAwesomeIcon viewBox="0 0 512 512" className="mr-3" icon={faMessage} />
                      Messages
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`flex items-center px-4 py-2 text-sm ${active && 'bg-once-200'} ${
                        path === '/profile/settings' ? 'border-r-2 border-r-once' : 'border-none'
                      }`}
                      href={`/profile/settings`}
                    >
                      <FontAwesomeIcon viewBox="0 0 512 512" className="mr-3" icon={faGears} />
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`border-t w-full flex items-center px-4 py-2 text-sm ${
                        active && 'bg-once-200 rounded-b-md'
                      }`}
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
                </Menu.Item>
              </Menu.Items>
            </Transition>
          )}
        </>
      )}
    </Menu>
  );
};

export default NavBarLoggedIn;
