import { useSelector } from "react-redux";
import { NoChatSelected, ChatContainer, SideBar } from "../components";
import SocketProvider from "../context/SocketProvider";

function App() {
  const selectedUser = useSelector(state => state.chatSlice.selectedUser);

  return (
    <SocketProvider>
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <SideBar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  )
}

export default App
