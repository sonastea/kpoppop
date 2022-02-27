import { faUser, faAngleDown, faAnglesDown, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from '@headlessui/react';

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
          <Menu.Button className="inline-flex items-center h-full p-2">
            {user?.username}
            {open ? (
              <FontAwesomeIcon className="ml-2" icon={faAnglesDown} />
            ) : (
              <FontAwesomeIcon className="ml-2" icon={faAngleDown} />
            )}
          </Menu.Button>
          {open && (
            <Menu.Items className="absolute right-0 w-40 mt-2 mr-2 bg-white shadow-sm origin-top-right rounded-md ring-1 ring-once ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`flex items-center px-4 py-2 text-sm ${active && 'bg-once'}`}
                    href={`/user/profile/${user?.username}`}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`w-full flex items-center px-4 py-2 text-sm ${active && 'bg-once'}`}
                    onClick={logoutHandler}
                  >
                    <FontAwesomeIcon viewBox="0 0 448 512" className="mr-2" icon={faArrowRightFromBracket} />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          )}
        </>
      )}
    </Menu>
  );
};

export default NavBarLoggedIn;
