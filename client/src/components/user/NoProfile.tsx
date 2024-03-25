type NoProfileProps = {
  message: string;
};

const NoProfile = (props: NoProfileProps) => {
  const { message } = props;

  return (
    <h2 className="flex h-[30vh] items-center justify-center text-lg text-slate-600 md:text-2xl">
      {message}
    </h2>
  );
};

export default NoProfile;
