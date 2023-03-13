import Memes from './Memes';
import UploadMeme from './UploadMeme';

const MemePage = () => {
  return (
    <div className="h-full bg-gray-100">
      <UploadMeme />
      <Memes />
    </div>
  );
};
export default MemePage;
