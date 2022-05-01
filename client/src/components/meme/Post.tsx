import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InteractiveButtons from './InteractiveButtons';
import InteractiveComments from './InteractiveComments';
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
      <div className="mx-4 shadow-sm">
        <div className="p-2 flex border-x">
          <div className="w-1/2 self-center">
            <img
              className="object-fit rounded-md lg:rounded-none"
              src={meme.url}
              alt={meme.title}
            />
          </div>
          <div className="flex-1 m-2">
            <div className="flex justify-end text-md md:text-xl text-once-900">
              <a href={`/user/${meme.author.username}`}>{meme.author.username}</a>
            </div>
            <div className="items-center h-3/4 text-sm md:text-xl">{meme.title}</div>
          </div>
        </div>
        <div className="border-t border-x">
          <InteractiveButtons memeId={parseInt(memeid!, 10)} memeTitle={meme.title} />
        </div>
        <div className="divide-y border">
          <InteractiveComments memeId={parseInt(memeid!, 10)} ownerId={meme.author.id} />
        </div>
      </div>
    </>
  );
};

export default Post;
