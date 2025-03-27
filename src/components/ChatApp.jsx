import React, { useEffect, useState } from "react";
import { Send, User } from "lucide-react";
const ChatApp = ({ socket, room, username }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleSendMessage = async e => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        room: room,
        text: message,
        username: username,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      await socket.emit("send_message", newMessage);
      setMessageList(prev => [...prev, newMessage]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", data => {
      if (data.user !== username) {
        setMessageList(prev => [...prev, data]);
      }
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket, username]);
  return (
    <>
      <div className="bg-gray-50 shadow-2xl w-[700px] h-[800px] rounded-lg   flex flex-col items-center">
        <div className="bg-blue-500 w-full h-22 flex justify-between p-5 text-white  ">
          <div>
            <p> Live Chat</p>
            <p>
              Logged in as <span className="font-bold"> {username} </span>
            </p>
          </div>
          <p className=" bg-blue-700 h-fit p-2 rounded-full text-sm">
            {" "}
            Room: {room}
          </p>
        </div>
        <div className="h-full flex flex-col w-full p-5">
          {messageList.map(item => {
            return (
              <div
                className={` flex ${
                  item.username === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%]    rounded-lg     p-3 mb-3 ${
                    item.username === username
                      ? "bg-[#2b7fff] text-white rounded-br-none"
                      : "bg-none border text-black rounded-bl-none"
                  } `}
                >
                  {item.username !== username && (
                    <div className="flex text-sm items-center gap-1 text-gray-500">
                      <User className="h-3 w-3 " />
                      <span className="text-xs font-medium text-gray-500">
                        {" "}
                        {item.username}
                      </span>
                    </div>
                  )}

                  <p> {item.text}</p>
                  <p
                    className={`text-xs text-right  ${
                      item.username === username
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {" "}
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-200 p-4 w-full flex gap-2 bg-white"
        >
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message here...."
            className="w-full  h-12 border-2  border-blue-600 rounded-lg pl-5 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`bg-[#d1d5dc] flex items-center p-3 rounded-lg ${
              !message.trim()
                ? "cursor-not-allowed text-gray-500"
                : "bg-blue-600 text-white cursor-pointer"
            } `}
          >
            {" "}
            <Send />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatApp;
