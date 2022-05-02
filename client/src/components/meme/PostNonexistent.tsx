type PostNonexistentProps = {
  message: string;
};

const PostNonexistent = (props: PostNonexistentProps) => {
  const { message } = props;

  return (
    <h2 className="flex items-center justify-center h-[30vh] text-lg md:text-2xl text-slate-500">
      {message}
    </h2>
  );
};

export default PostNonexistent;
