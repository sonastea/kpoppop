import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-200/60">
      <span
        className="absolute mx-auto box-content flex w-fit select-none border bg-gradient-to-r
          from-once-600 to-ponce-600 bg-clip-text text-center text-6xl font-extrabold
          text-transparent blur-xl"
      >
        Back to kpoppop
      </span>
      <Link
        to="/"
        className="relative top-0 flex h-auto w-fit select-auto items-center justify-center
          bg-gradient-to-r from-once-600 to-ponce-600 bg-clip-text text-center text-6xl
          font-extrabold text-transparent hover:text-thrice"
      >
        Back to kpoppop
      </Link>
    </div>
  );
};

export default ErrorPage;
