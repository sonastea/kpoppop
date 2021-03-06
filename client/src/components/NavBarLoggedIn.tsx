import { faUser, faAngleDown, faAnglesDown, faArrowRightFromBracket, faGears } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from 'contexts/AuthContext';

const NavBarLoggedIn = () => {
  const { user, logout } = useAuth();

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
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transofrm scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-900 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 w-40 mt-2 mr-2 bg-white border shadow origin-top-right rounded-md ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`flex items-center px-4 py-2 text-sm ${active && 'bg-once-200'}`}
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
                      className={`flex items-center px-4 py-2 text-sm ${active && 'bg-once-200'}`}
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
                      className={`border-t w-full flex items-center px-4 py-2 text-sm ${active && 'bg-once-200'}`}
                      onClick={logoutHandler}
                    >
                      <FontAwesomeIcon viewBox="0 0 512 512" className="mr-3" icon={faArrowRightFromBracket} />
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
