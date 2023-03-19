import ScrollToTopButton from 'components/button/ScrollToTopButton';
import Memes from './Memes';
import UploadMeme from './UploadMeme';

const MemePage = () => {
  return (
    <div className="h-full bg-gray-100">
      <ScrollToTopButton />
      <UploadMeme />
      <Memes />
    </div>
  );
};
export default MemePage;
