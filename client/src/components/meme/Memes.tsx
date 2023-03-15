import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DAY } from 'Global.d';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import InteractiveButtons from './InteractiveButtons';
import { fetchMemes } from './MemeAPI';
import MemeMenu from './MemeMenu';
import ReportMemeModal from './ReportMemeModal';

type Meme = {
  author: { username: string };
  active: boolean;
  authorId: number;
  id: number;
  title: string;
  url: string;
  createdAt: string;
};

let cursor: number = 0;

const Memes = () => {
  const [posts, setPosts] = useState([] as any);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {
    setLoading(false);
    await fetchMemes(cursor)
      .then((memes) => {
        if (memes.length !== 0) {
          setPosts((prev: Meme[]) => [...prev, ...memes]);
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
        .catch((error) => console.error(error));
    };

    loadData().catch((error) => console.error(error));

    const handleScrollRef: any = handleScroll.current;
    window.addEventListener('scroll', handleScrollRef);
    return () => {
      window.removeEventListener('scroll', handleScrollRef);
    };
  }, []);

  const handleScroll = useRef((e: Event) => {
    const { innerHeight, scrollY } = e.currentTarget as Window;

    if (!loading && innerHeight + scrollY >= document.body.scrollHeight) {
      setLoading(true);
      fetchData();
    }
  });

  return (
    <>
      <div className="meme-container flex flex-col items-center">
        {posts &&
          posts.map((meme: Meme) => {
            const title = meme.title.replace(/ /g, '_');
            return (
              <div
                className="w-full my-2 shadow-sm sm:max-w-2xl sm:rounded-md bg-white"
                key={meme.id}
              >
                <div className="flex overflow-hidden leading-normal mx-4 mt-4 mb-2 md:text-xl author-bar">
                  <a
                    className="font-bold hover:text-once-700"
                    href={`/user/${meme.author.username}`}
                  >
                    {meme.author.username}
                  </a>
                  <div className="ml-2">
                    <span className="text-xs sm:text-sm text-gray-500">
                      {DAY(meme.createdAt).fromNow(true)}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <ReportMemeModal id={meme.id} />
                    <MemeMenu memeId={meme.id.toString()} />
                  </div>
                </div>
                <div className="flex mx-4 my-2">
                  <a
                    className="hover:underline text-slate-900 text-sm md:text-lg"
                    href={`/meme/${meme.id}/${title}`}
                  >
                    {meme.title}
                  </a>
                </div>
                {meme.url.split('.')[3] === 'mp4' ? (
                  <video
                    key={meme.title}
                    className="object-cover aspect-square w-full mx-auto md:max-h-lg md:aspect-auto"
                    controls
                    muted
                  >
                    <source src={meme.url} type="video/mp4" />
                  </video>
                ) : (
                  <a className="contents" href={`/meme/${meme.id}/${title}`}>
                    <img className="w-full max-h-lg mt-2" src={meme.url} alt={meme.title} />
                  </a>
                )}
                <InteractiveButtons memeId={meme.id} memeTitle={title} />
              </div>
            );
          })}
      </div>

      <div
        onScroll={() => handleScroll.current}
        id="scroll-load-div"
        className="flex justify-center p-5 page-number"
      >
        {loading && <FontAwesomeIcon className="-z-1" icon={faSpinner} spin />}
      </div>
    </>
  );
};

export default Memes;
