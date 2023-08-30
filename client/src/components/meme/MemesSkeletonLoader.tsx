
const MemesSkeletonLoader = () => {
  const MemesItemSkeleton = () => {
    return (
      <li className="w-full my-2 shadow-sm max-w-5xl sm:max-w-2xl sm:rounded-md bg-white animate-pulse">
        <div className="flex flex-wrap overflow-auto leading-normal mx-4 mt-4 mb-2 md:text-xl">
          <div className="rounded-full w-1/3 bg-gray-200" />
          <div className="rounded-full ml-2 w-1/6 bg-gray-200"></div>
          <div className="ml-auto">&nbsp;</div>
        </div>
        <div className="flex mx-4 my-2">
          <div className="hover:underline text-slate-900 text-sm md:text-lg w-full bg-gray-200 rounded-full">
            &nbsp;
          </div>
        </div>
        <div className="flex justify-center items-center rounded h-96 max-h-64 md:max-h-96 object-scale-down md:object-contain mt-2 bg-gray-200">
          <svg
            className="w-10 h-10 text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="py-2 md:py-4 flex flex-wrap justify-center gap-x-4">
          <div className="rounded-full bg-gray-200 w-4 h-4 md:w-6 md:h-6" />
          <div className="rounded-full bg-gray-200 w-4 h-4 md:w-6 md:h-6" />
        </div>
      </li>
    );
  };

  return Array.apply(null, Array(9)).map((_, i) => {
    return <MemesItemSkeleton key={i} />;
  });
};

export default MemesSkeletonLoader;
