import { useAuth } from '../contexts/AuthContext';
import MobileNav from './MobileNav';
import NavBarLoggedIn from './NavBarLoggedIn';
import NavBarLoggedOut from './NavBarLoggedOut';

const NavBar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div>
              <a href="/" className="flex items-center px-2 py-2">
                <img src="images/logo.png" alt="Kpoppop Logo" className="w-10 h-10 mr-2"></img>
              </a>
            </div>

            <ul className="items-center hidden border-b md:flex space-x-1">
              <li>
                <a href="/memes" className="px-2 py-2 font-semibold text-gray-900 hover:text-gray-700">
                  Memes
                </a>
              </li>
              <li>
                <a href="/contact" className="px-2 py-2 font-semibold text-gray-900 hover:text-gray-700">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="items-center hidden md:flex space-x-3 ">
            <a href="/login" className="px-2 py-2 font-semibold rounded transition duration-300">
              Sign Up
            </a>
            <a href="/register" className="px-2 py-2 font-semibold rounded transition duration-300">
              Log In
            </a>
          </div>

          <div className="flex items-center md:hidden">
            <button className="mobile-menu-button">
              <svg
                className="w-6 h-6"
                x-show="!showMenu"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
