import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const className =
    'p-2 font-semibold text-transparent bg-gray-200 border-b-2 border-transparent rounded-full';

  return (
    <nav className="relative w-full shadow-md">
      <div className="mx-auto md:max-w-screen-2xl">
        <div className="flex flex-wrap justify-between overflow-hidden md:overflow-visible">
          <div className="flex flex-shrink-0 space-x-2">
            <Link
              aria-label="Home"
              to="/"
              className="aspect-w-2 aspect-h-1 m-2 flex h-10 grow-0 items-center sm:h-16"
            >
              <img
                src="/images/header_logo.png"
                alt="Kpoppop Logo"
                className="h-full w-16 object-contain md:w-24"
              />
            </Link>

            <ul className="hidden animate-pulse items-center space-x-1 md:flex">
              <li>
                <Link className={className} to="">
                  Home
                </Link>
              </li>
              <li>
                <Link className={className} to="">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="m-2 flex flex-wrap items-center md:hidden">
            <button aria-label="Mobile menu toggle" className="mobile-menu-toggle">
              <svg
                className="ml-1 h-8 w-8 animate-pulse text-gray-800"
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
        </div>
      </div>
    </nav>
  );
};

const LoadingUI = () => {
  useEffect(() => {
    const img = new Image();
    img.src = '/images/header_logo.png';
  }, []);

  return (
    <>
      <NavBar />
      <div className="h-screen bg-gray-200/60"></div>
    </>
  );
};

export default LoadingUI;
