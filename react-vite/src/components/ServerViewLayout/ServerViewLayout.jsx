import styles from "./ServerViewLayout.module.css"

// Util
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllServersThunk } from "../../redux/server"
import { fetchChannelsForServerIdThunk } from "../../redux/channel"
import { fetchChannelMessagesThunk, createMessageThunk } from "../../redux/message"
import { fetchServerUsersThunk } from "../../redux/serverUser"

// Components
import ServerNav from "../ServerNav/ServerNav"
import ChannelNav from "../ChannelNav/ChannelNav"
import UserList from "../UserList/UserList"
import HeaderInfo from "../HeaderInfo/HeaderInfo"
import ServerView from "../ServerView/ServerView"
import ChatRoom from "../MessageInput/MessageInput"

export default function ServerViewLayout(){
    const dispatch = useDispatch();
    const [activeServerId, setActiveServerId] = useState(1);
    const [activeChannelId, setActiveChannelId] = useState(1);

    const servers = Object.values(useSelector((state) => state.servers));
    const channels = Object.values(useSelector((state) => state.channels));
    const messages = useSelector((state) => state.messages[activeChannelId] || []);
    const serverUsers = Object.values(useSelector((state) => state.serverUsers));

    useEffect(() => {
        dispatch(fetchAllServersThunk());
        dispatch(fetchChannelsForServerIdThunk(activeServerId));
        dispatch(fetchChannelMessagesThunk(activeChannelId));
        dispatch(fetchServerUsersThunk(activeServerId));
    }, [dispatch, activeServerId, activeChannelId]);

    const handleLeave = () => {
        // Handle leave logic
    };

    const handleSendMessage = (message) => {
        console.log('Sending message:', message); // Debugging line
        dispatch(createMessageThunk(activeChannelId, { text_field: message }));
    };

    return (
        <main className={styles.body}> 
            <ServerNav servers={servers} />
            <ChannelNav 
                channels={channels}
                setActiveChannelId={setActiveChannelId} // Ensure you pass the setActiveChannelId function to update the active channel
            />
            <section className={styles.main}>
                <HeaderInfo />
                <div className={styles.channel_view}>
                    <ServerView 
                        activeServerId={activeServerId}
                        activeChannelId={activeChannelId}
                        messages={messages}
                    />
                    <UserList 
                        serverUsers={serverUsers}
                    />
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
    )
}

