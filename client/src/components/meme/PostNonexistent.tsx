type PostNonexistentProps = {
  message: string;
};

const PostNonexistent = (props: PostNonexistentProps) => {
  const { message } = props;

  return (
    <h2 className="flex h-[30vh] items-center justify-center text-lg text-slate-500 md:text-2xl">
      {message}
    </h2>
  );
};

export default PostNonexistent;
