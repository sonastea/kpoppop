const MemesSkeletonLoader = () => {
  const MemesItemSkeleton = () => {
    return (
      <li
        className="my-2 w-full max-w-5xl animate-pulse bg-white shadow-sm sm:max-w-2xl
          sm:rounded-md"
      >
        <div className="mx-4 mb-2 mt-4 flex flex-wrap overflow-auto leading-normal md:text-xl">
          <div className="w-1/3 rounded-full bg-gray-200" />
          <div className="ml-2 w-1/6 rounded-full bg-gray-200"></div>
          <div className="ml-auto">&nbsp;</div>
        </div>
        <div className="mx-4 my-2 flex">
          <div
            className="w-full rounded-full bg-gray-200 text-sm text-slate-900 hover:underline
              md:text-lg"
          >
            &nbsp;
          </div>
        </div>
        <div
          className="mt-2 flex h-96 max-h-64 items-center justify-center rounded bg-gray-200
            object-scale-down md:max-h-96 md:object-contain"
        >
          <svg
            className="h-10 w-10 text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5
              4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0
              1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1
              0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
            />
          </svg>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 py-2 md:py-4">
          <div className="h-4 w-4 rounded-full bg-gray-200 md:h-6 md:w-6" />
          <div className="h-4 w-4 rounded-full bg-gray-200 md:h-6 md:w-6" />
        </div>
      </li>
    );
  };

  return [...Array(9)].map((_, i) => {
    return <MemesItemSkeleton key={i} />;
  });
};

export default MemesSkeletonLoader;
