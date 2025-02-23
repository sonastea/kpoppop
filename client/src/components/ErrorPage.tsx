import { Link } from 'react-router';

const ErrorPage: React.FC = () => {
  return (
    <div
      className="flex w-full items-center justify-center bg-gray-200/60 h-screen-mobile
        sm:h-screen-larger"
    >
      <span
        className="bg-linear-to-r absolute mx-auto box-content flex w-fit select-none border
          from-once-600 to-ponce-600 bg-clip-text py-2 text-center text-6xl font-extrabold
          text-transparent blur-xl"
      >
        Back to kpoppop
      </span>
      <Link
        to="/"
        className="bg-linear-to-r relative top-0 flex h-auto w-fit select-auto items-center
          justify-center from-once-600 to-ponce-600 bg-clip-text py-2 text-center text-6xl
          font-extrabold text-transparent hover:text-thrice"
      >
        Back to kpoppop
      </Link>
    </div>
  );
};

export default ErrorPage;
