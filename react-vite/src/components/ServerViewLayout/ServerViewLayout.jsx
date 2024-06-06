import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllServersThunk } from "../../redux/server";
import { fetchChannelsForServerIdThunk } from "../../redux/channel";
import { fetchChannelMessagesThunk, createMessageThunk } from "../../redux/message";
import { fetchServerUsersThunk } from "../../redux/serverUser";
import ServerNav from "../ServerNav/ServerNav";
import ServerView from "../ServerView/ServerView";
import HeaderInfo from "../HeaderInfo/HeaderInfo";
import ChannelNav from "../ChannelNav/ChannelNav";
import UserList from "../UserList/UserList";
import ChatRoom from "../MessageInput/MessageInput";
import styles from "./ServerViewLayout.module.css";

export default function ServerViewLayout() {
  const dispatch = useDispatch();
  const [activeServerId, setActiveServerId] = useState(1);
  const [activeChannelId, setActiveChannelId] = useState(1);

  const servers = useSelector((state) => state.servers);
  const channels = useSelector((state) => state.channels);
  const messagesState = useSelector((state) => state.messages);
  const serverUsers = useSelector((state) => state.serverUsers);

  const serversList = useMemo(() => Object.values(servers), [servers]);
  const channelsList = useMemo(() => Object.values(channels), [channels]);
  const messages = useMemo(() => messagesState[activeChannelId] || [], [messagesState, activeChannelId]);
  const serverUsersList = useMemo(() => Object.values(serverUsers), [serverUsers]);

  useEffect(() => {
    dispatch(fetchAllServersThunk());
    dispatch(fetchChannelsForServerIdThunk(activeServerId));
    dispatch(fetchChannelMessagesThunk(activeChannelId));
    dispatch(fetchServerUsersThunk(activeServerId));
  }, [dispatch, activeServerId, activeChannelId]);

  console.log("ServerViewLayout rendered");

  const handleLeave = useCallback(() => {
    // Handle leave logic (for later)
  }, []);

  const handleSendMessage = useCallback((message) => {
    console.log('Sending message:', message);
    dispatch(createMessageThunk(activeChannelId, { text_field: message }));
  }, [dispatch, activeChannelId]);

  return (
    <main className={styles.body}>
       <ServerNav servers={serversList} setActiveServerId={setActiveServerId} />
       <ChannelNav channels={channelsList} setActiveChannelId={setActiveChannelId} />
       
      <section className={styles.main}>
        <HeaderInfo />
        <div className={styles.channel_view}>
          <ServerView
            activeServerId={activeServerId}
            activeChannelId={activeChannelId}
            messages={messages}
          />
          <UserList serverUsers={serverUsersList} />
          <div className={styles.chatRoomContainer}>
            <ChatRoom
              channelId={activeChannelId}
              messages={messages}
              handleLeave={handleLeave}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
