import ScrollToTopButton from 'components/button/ScrollToTopButton';
import Memes from './Memes';
import UploadMeme from './UploadMeme';

const MemePage = () => {
  return (
    <div className="h-full bg-gray-200/50">
      <ScrollToTopButton />
      <UploadMeme />
      <Memes />
    </div>
  );
};
export default MemePage;
