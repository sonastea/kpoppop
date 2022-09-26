import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReportCommentModal from 'components/user/ReportCommentModal';
import ReportUserModal from 'components/user/ReportUserModal';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InteractiveButtons from './InteractiveButtons';
import InteractiveComments from './InteractiveComments';
import { fetchMeme } from './MemeAPI';
import PostNonexistent from './PostNonexistent';

type PostProps = {
  author: {
    id: number;
    username: string;
  };
  id: number;
  title: string;
  url: string;
};

const Post = () => {
  const { memeid } = useParams();
  const [meme, setMeme] = useState<PostProps>({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeme = async (id: number) => {
      setLoading(true);
      await fetchMeme(id).then((data: PostProps) => {
        setMeme(data);
      });
      setLoading(false);
    };
    loadMeme(parseInt(memeid!));
  }, [setMeme, memeid]);

  if (loading) return <FontAwesomeIcon id="scroll-load-div" icon={faSpinner} spin />;

  return Object.keys(meme).length === 0 ? (
    <PostNonexistent message={'Post does not exist'} />
  ) : (
    <>
      <ReportCommentModal />
      <ReportUserModal user={{ id: meme.author.id, username: meme.author.username }} />
      <div className="mx-4 shadow-sm mb-2">
        <div className="p-0 md:p-2 flex flex-col md:flex-row md:flex-wrap overflow-auto border-x">
          <div className="md:max-w-md 2xl:max-w-lg self-center">
            {meme.url.split('.')[3] === 'mp4' ? (
              <video
                key={meme.title}
                className="object-fit w-auto rounded-b-md md:rounded-none md:-ml-2 md:-mt-2"
                controls
                muted
              >
                <source src={meme.url} type="video/mp4" />
              </video>
            ) : (
              <img
                className="object-fit w-auto rounded-b-md md:rounded-none md:-ml-2 md:-mt-2"
                src={meme.url}
                alt={meme.title}
              />
            )}
          </div>
          <div className="flex-1 m-2">
            <div className="flex justify-end text-md md:text-xl text-once-900">
              <a href={`/user/${meme.author.username}`}>{meme.author.username}</a>
            </div>
            <div className="grid content-center h-3/4 text-sm md:text-xl">{meme.title}</div>
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
