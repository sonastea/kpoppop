import { lazy } from 'react';

const ScrollToTopButton = lazy(() => import('components/button/ScrollToTopButton'));
const Memes = lazy(() => import('./Memes'));

const MemePage = () => {
  return (
    <div className="h-full bg-gray-200/60">
      <ScrollToTopButton />
      <Memes />
    </div>
  );
};

export default MemePage;
