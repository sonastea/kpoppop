import Header from "./Header";
import MessageBox from "./MessageBox";
import MessageWindow from "./MessageWindow";

const Conversation = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <MessageWindow />
      <MessageBox />
    </div>
  );
};

export default Conversation;
