import styles from "./ServerView.module.css"

// Util
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchChannelsForServerIdThunk } from "../../redux/channel"
import { fetchChannelMessagesThunk } from "../../redux/message"
import { fetchServerUsersThunk } from "../../redux/serverUser"

// Components
import MessageLayout from "../MessageLayout/MessageLayout"
import ChannelNav from "../ChannelNav/ChannelNav"
import HeaderInfo from "../HeaderInfo/HeaderInfo"
import UserList from "../UserList/UserList"

export default function ServerView({ activeServerId, activeServer, activeChannelId, setActiveChannelId, prevChannelId, setPrevChannelId, currentUser }) {
    const dispatch = useDispatch()
    const channels = Object.values(useSelector((state) => state.channels));
    const messages = Object.values(useSelector((state) => state.messages));
    const serverUsers = Object.values(useSelector((state) => state.serverUsers));
    const activeChannel = useMemo(() => channels.filter(channel => channel.id === activeChannelId)[0], [activeChannelId, channels]);
    console.log("GET ALL MESSAGES", messages)
    // const currentUser = Object.values(useSelector((state) => state.currentUser));
    // const currentServer = useSelector((state) => state.servers[`${activeServerId}`]);
    // const activeChannel = useSelector((state) => state.channels[`${activeChannelId}`]);

    useEffect(() => {
        dispatch(fetchChannelsForServerIdThunk(activeServerId));
        dispatch(fetchChannelMessagesThunk(activeChannelId))
        dispatch(fetchServerUsersThunk(activeServerId))
    }, [dispatch, activeServerId, activeChannelId])

    // useEffect(() => {
    //     // This is responsible for changing the active channel when the server changes
    //     setActiveChannelId(channels[0]?.id)
    // }, [activeServerId, channels, setActiveChannelId])

    return (
        <section className={styles.serverView}>
            <ChannelNav 
                channels={channels} 
                activeChannel={activeChannel} 
                setActiveChannel={setActiveChannelId} 
                setPrevChannel={setPrevChannelId} 
                activeServer={activeServer}
                currentUser={currentUser}
            />
            <HeaderInfo 
                activeChannel={activeChannel}
                activeServer={activeServer}
            />
            <MessageLayout 
                defaultMessages={messages} 
                channelId={activeChannelId} 
                prevChannelId={prevChannelId}
                currentUser={currentUser}
            />
            <UserList users={serverUsers} />
        </section>
    )
}