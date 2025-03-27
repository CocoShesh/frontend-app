import { useState } from "react";
import io from "socket.io-client";
import ChatApp from "./components/ChatApp";

const socket = io.connect("https://practice-coding.onrender.com");
function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isRoomId, setIsRoomId] = useState(false);

  const handleJoinRoom = () => {
    socket.emit("join_room", roomId);
    setIsRoomId(!isRoomId);
  };
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen ">
        {!isRoomId ? (
          <div className="bg-gray-50 shadow-2xl w-[500px] h-[400px] rounded-lg px-8  py-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold my-3"> Join a Chat Room</h1>
            <p> Enter your username and a room ID to start chatting</p>
            <form onSubmit={handleJoinRoom} className="w-full">
              <div className="flex flex-col gap-5 w-full pt-7">
                <input
                  type="text"
                  value={username}
                  placeholder="Your username..."
                  className=" h-14 w-full border pl-5 rounded-lg border-[#d1d5dc]"
                  onChange={e => setUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Room ID...."
                  value={roomId}
                  className=" h-14 w-full border pl-5 rounded-lg border-[#d1d5dc]"
                  onChange={e => setRoomId(e.target.value)}
                />
                <button
                  disabled={!roomId || !username}
                  type="submit"
                  className={` h-14 rounded-lg text-white text-lg ${
                    !roomId || !username
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600  cursor-pointer hover:bg-blue-700 active:bg-blue-800"
                  }`}
                >
                  Join Room
                </button>
              </div>
            </form>
          </div>
        ) : (
          <ChatApp socket={socket} username={username} room={roomId} />
        )}
      </div>
    </>
  );
}

export default App;
