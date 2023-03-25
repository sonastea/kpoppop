import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReportCommentModal from 'components/user/ReportCommentModal';
import ReportUserModal from 'components/user/ReportUserModal';
import { DAY } from 'Global.d';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InteractiveButtons from './InteractiveButtons';
import InteractiveComments, { CommentProps } from './InteractiveComments';
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
  createdAt: string;
  likedBy: { id: number }[];
  _count: {
    comments: number;
    likedBy: number;
  };
  comments: CommentProps[];
};

const Post = () => {
  const { memeid } = useParams();
  const [meme, setMeme] = useState<PostProps>({} as PostProps);
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
      <div className="shadow-sm mb-2">
        <div className="flex flex-col md:flex-row md:flex-wrap overflow-auto border-x">
          <div className="m-2 w-64 md:w-80 2xl:w-96 max-w-3xl self-center">
            {meme.url.split('.')[3] === 'mp4' ? (
              <video key={meme.title} className="object-fit max-h-lg w-auto" controls muted>
                <source src={meme.url} type="video/mp4" />
              </video>
            ) : (
              <img className="object-fill w-full" src={meme.url} alt={meme.title} />
            )}
          </div>
          <div className="flex-1 m-2">
            <div className="flex flex-col items-end text-md md:text-xl text-once-900">
              <a href={`/user/${meme.author.username}`}>{meme.author.username}</a>
              <span className="text-xs sm:text-sm text-once-900/70">
                {DAY(meme.createdAt).fromNow(false)}{' '}
              </span>
            </div>
            <div className="grid content-center h-3/4 text-sm md:text-xl">{meme.title}</div>
          </div>
        </div>
        <div className="border-t border-x">
          <InteractiveButtons
            memeId={parseInt(memeid!, 10)}
            memeTitle={meme.title}
            liked={meme.likedBy.length !== 0}
            comments={meme._count.comments}
            likes={meme._count.likedBy}
          />
        </div>
        <div className="divide-y border">
          <InteractiveComments
            memeId={parseInt(memeid!, 10)}
            ownerId={meme.author.id}
            comments={meme.comments}
          />
        </div>
      </div>
    </>
  );
};

export default Post;
