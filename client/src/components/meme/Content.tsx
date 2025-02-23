import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchMeme } from './MemeAPI';

const Content = () => {
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
      <div className="content-header">
        <div className="max-w-sm">
          <img className="rounded-2 mt-2" src={meme.url} alt={meme.title} />
        </div>
        <div className="d-flex flex-column">
          <div className="content-title">
            <div>{meme.title}</div>
          </div>
          <div className="author-bar mt-auto">
            <div>
              <a href={`/user/${meme.author.username}`}>{meme.author.username}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
