
const Buttons = (props: any) => {
  const {
    id,
    author: { username },
  } = props;
  const title = props.title.replace(/ /g, '_');

  return (
    <>
      <div className="content-title">
          <a className="meme-buttons" href={`/meme/${id}/${title}`}>
            {props.title}
          </a>
      </div>
      <div className="author-bar">
        <a className="author-bar meme-buttons" href={`/user/profile/${username}`}>
            {username}
          </a>
      </div>
      <div className="mt-auto">
          <a className="comments meme-buttons" href={`/meme/${id}/${title}`}>
            Comments
          </a>
      </div>
    </>
  );
};

export default Buttons;
