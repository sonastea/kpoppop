import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import InteractiveButtons from './InteractiveButtons';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMeme } from './MemeAPI';

const Post = () => {
  const { memeid } = useParams();
  const [meme, setMeme] = useState({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeme = async (id: number) => {
      setLoading(true);
      await fetchMeme(id).then((data) => setMeme(data));
      setLoading(false);
    };
    loadMeme(parseInt(memeid!));
  }, [setMeme, memeid]);

  return loading ? (
    <FontAwesomeIcon id="scroll-load-div" icon={faSpinner} spin />
  ) : (
    <>
      <div className="m-5 shadow-md">
        <div className="flex">
          <div className="w-1/2 md:w-1/5">
            <img className="object-fill rounded-md lg:rounded-none" src={meme.url} alt={meme.title} />
          </div>
          <div className="flex-1 m-2">
            <div className="flex justify-end text-lg font-bold md:text-2xl">
              <a href={`/user/profile/${meme.author.username}`}>{meme.author.username}</a>
            </div>
            <div className="flex items-center font-bold h-3/4 text-md md:text-2xl">{meme.title}</div>
          </div>
        </div>
        <InteractiveButtons memeId={parseInt(memeid!, 10)} />
      </div>
    </>
  );
};

export default Post;
