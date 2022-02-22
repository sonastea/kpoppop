import Buttons from './Buttons';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchMemes } from './MemeAPI';
import Like from './Like';

let cursor: number = 0;

const Memes = () => {
  const [posts, setPosts] = useState([] as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchMemes(cursor)
        .then((memes) => {
          if (memes.length !== 0) {
            setPosts((prev: any) => [...prev, ...memes]);
            cursor = memes[memes.length - 1].id;
          }
        })
        .catch((_error) => {});
    };

    loadData().catch((error) => console.log(error));

    const handleScrollRef: any = handleScroll.current;
    window.addEventListener('scroll', handleScrollRef);
    return () => {
      window.removeEventListener('scroll', handleScrollRef);
    };
  }, []);

  const loadMorePosts = async () => {
    setLoading(false);
    await fetchMemes(cursor)
      .then((memes) => {
        if (memes.length !== 0) {
          setPosts((prev: any) => [...prev, ...memes]);
          cursor = memes[memes.length - 1].id;
        } else {
          window.removeEventListener('scroll', handleScroll.current);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchData = debounce(loadMorePosts, 1000);

  const handleScroll = useRef((e: any) => {
    const { innerHeight, scrollY } = e.currentTarget;

    if (!loading && innerHeight + scrollY >= document.body.scrollHeight) {
      setLoading(true);
      fetchData();
    }
  });

  return (
    <>
      {posts &&
        posts.map((meme: any) => {
          if (meme.active) {
            return (
              <div className="mt-3 mb-3 meme rounded-2" id={meme.id} key={meme.id}>
                <div>
                  <a href={`/meme/${meme.id}/${meme.title}`}>
                    <img className="max-w-xs mt-2 max-h-xs meme-thumbnail rounded-2" src={meme.url} alt={meme.title} />
                  </a>
                <div>
                  <Buttons {...meme} />
                </div>
                <div>
                  <Like memeId={meme.id} />
                </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      <div onScroll={handleScroll.current} id="scroll-load-div" className="p-5 page-number">
        {loading && <FontAwesomeIcon icon={faSpinner} spin />}
      </div>
    </>
  );
};

export default Memes;
