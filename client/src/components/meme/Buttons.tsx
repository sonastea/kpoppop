
const Buttons = (props: any) => {
  const {
    id,
    author: { username },
  } = props;
  const title = props.title.replace(/ /g, '_');

  return (
    <>
      <div className="content-title">
        <div>
          <a className="meme-buttons" href={`/meme/${id}/${title}`}>
            {props.title}
          </a>
        </div>
      </div>
      <div className="author-bar mt-1">
        <div>
        <a className="author-bar meme-buttons" href={`/user/profile/${username}`}>
            {username}
          </a>
        </div>
      </div>
      <div className="mt-auto">
        <div>
          <a className="comments meme-buttons" href={`/meme/${id}/${title}`}>
            Comments
          </a>
        </div>
      </div>
    </>
  );
};

export default Buttons;
