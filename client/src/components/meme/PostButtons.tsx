import Like, { LikeProps } from './Like';

const PostButtons = (props: LikeProps) => {
  return (
    <>
      <div className="list-buttons mt-2">
        <Like memeId={props.memeId} />
      </div>
    </>
  );
};

export default PostButtons;
