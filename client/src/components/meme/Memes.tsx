import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import InteractiveButtons from './InteractiveButtons';
import { fetchMemes } from './MemeAPI';

let cursor: number = 0;

const Memes = () => {
  const [posts, setPosts] = useState([] as any);
  const [loading, setLoading] = useState(false);

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
      .catch((_error) => {});
  };

  const fetchData = debounce(loadMorePosts, 1000);

  useEffect(() => {
    const loadData = async () => {
      await fetchMemes(cursor)
        .then((memes) => {
          if (memes.length !== 0) {
            setPosts(memes);
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

  const handleScroll = useRef((e: any) => {
    const { innerHeight, scrollY } = e.currentTarget;

    if (!loading && innerHeight + scrollY >= document.body.scrollHeight) {
      setLoading(true);
      fetchData();
    }
  });

  return (
    <>
      <div className="meme-container">
        {posts &&
          posts.map((meme: any) => {
            const title = meme.title.replace(/ /g, '_');
            return (
              <div
                className="m-4 shadow-md bg-gradient-to-br from-gray-300 rounded-md"
                key={meme.id}
              >
                <div className="flex-row items-center p-8 box-border rounded-md">
                  <div className="flex pb-6 text-lg font-bold md:text-2xl author-bar">
                    <a className="hover:text-once-700" href={`/user/${meme.author.username}`}>
                      {meme.author.username}
                    </a>
                  </div>
                  <div className="flex-col justify-center">
                    {meme.url.split('.')[3] === 'mp4' ? (
                      <video
                        key={meme.title}
                        className="rounded-md mx-auto md:max-w-2xl md:max-h-2xl"
                        controls
                        muted
                      >
                        <source src={meme.url} type="video/mp4" />
                      </video>
                    ) : (
                      <a className="contents" href={`/meme/${meme.id}/${title}`}>
                        <img
                          className="mx-auto md:max-w-2xl rounded-md md:max-h-2xl"
                          src={meme.url}
                          alt={meme.title}
                        />
                      </a>
                    )}
                  </div>
                  <div className="flex justify-center py-3">
                    <a
                      className="hover:underline font-bold text-gray-800 text-md md:text-3xl 2xl:text-5xl"
                      href={`/meme/${meme.id}/${title}`}
                    >
                      {meme.title}
                    </a>
                  </div>
                  <InteractiveButtons memeId={meme.id} memeTitle={title} />
                </div>
              </div>
            );
          })}
      </div>

      <div
        onScroll={handleScroll.current}
        id="scroll-load-div"
        className="flex justify-center p-5 page-number"
      >
        {loading && <FontAwesomeIcon className="-z-1" icon={faSpinner} spin />}
      </div>
    </>
  );
};

export default Memes;
