import styles from "./ServerView.module.css"

// Util
import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchChannelsForServerIdThunk } from "../../redux/channel"
import { fetchChannelMessagesThunk } from "../../redux/message"
import { fetchServerUsersThunk, fetchCurrentUser } from "../../redux/serverUser"

// Components
import MessageLayout from "../MessageLayout/MessageLayout"
import ChannelNav from "../ChannelNav/ChannelNav"
import HeaderInfo from "../HeaderInfo/HeaderInfo"
import UserList from "../UserList/UserList"

export default function ServerView({ activeServerId, activeServer }) {
    const dispatch = useDispatch()
    const [activeChannelId, setActiveChannelId] = useState(1);
    const channels = Object.values(useSelector((state) => state.channels))
    const messages = Object.values(useSelector((state) => state.messages));
    const serverUsers = Object.values(useSelector((state) => state.serverUsers));

    const currentUser = Object.values(useSelector((state) => state.currentUser));
    const currentServer = useSelector((state) => state.servers[`${activeServerId}`]);
    const activeChannel = useSelector((state) => state.channels[`${activeChannelId}`]);


    useEffect(() => {
        dispatch(fetchChannelsForServerIdThunk(activeServerId));
        dispatch(fetchChannelMessagesThunk(activeChannelId))
        dispatch(fetchServerUsersThunk(activeServerId))
        dispatch(fetchCurrentUser())
    }, [dispatch, activeServerId, activeChannelId])

    useEffect(() => {
        // This is responsible for changing the active channel when the server changes
        setActiveChannelId(channels[0]?.id)
    }, [activeServerId, channels])


    return (
        <section className={styles.serverView}>
            <ChannelNav 
                channels={channels} 
                setActiveChannel={setActiveChannelId} 
                activeServerId={activeServerId}
                currentUser={currentUser}
                currentServerOwner={currentServer?.owner_id}
                activeServer={activeServer}
            />
            <HeaderInfo activeServerId={activeServerId}/>
            <MessageLayout messages={messages} channelId={activeChannel?.id} />
            <UserList users={serverUsers} />
        </section>
    )
}