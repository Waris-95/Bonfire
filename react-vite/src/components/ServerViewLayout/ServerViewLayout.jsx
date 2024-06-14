import styles from "./ServerViewLayout.module.css"

// Util
import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllServersThunk } from "../../redux/server"
import { fetchChannelsForServerIdThunk } from "../../redux/channel"
import { fetchCurrentUser } from "../../redux/serverUser"
import SignupFormPage from "../SignupFormPage/SignupFormPage"
// import LoginFormModal from "../LoginFormModal/LoginFormModal"
// import { getChannelMessages, getChannelsForServerId } from "../../utils/api"

// Components
import ServerNav from "../ServerNav/ServerNav"
import ServerView from "../ServerView/ServerView"
// import OpenModalButton from "../OpenModalButton/OpenModalButton"

export default function ServerViewLayout(){
    const dispatch = useDispatch();
    const [activeServerId, setActiveServerId] = useState(1);
    const [activeChannelId, setActiveChannelId] = useState(1);
    const [prevChannelId, setPrevChannelId] = useState(1);

    const servers = Object.values(useSelector((state) => state.servers));
    const activeServer = useMemo(() => servers.filter(server => server.id === activeServerId)[0], [activeServerId, servers]);
    const currentUser = Object.values(useSelector((state) => state.currentUser));
    console.log("DATA ALL SERVERS", servers)
    console.log("DATA SERVER CHANNELS", servers[0]?.channels)
    console.log("DATA SERVER USERS", servers[0]?.users)
    console.log("DATA SERVER CHANNEL MESSAGES", servers[0]?.channels[0]?.channel_messages)
    console.log("DATA SERVER CHANNEL MESSAGES", servers[0]?.channels[0]?.channel_messages[0])
    
    useEffect(() => {
        dispatch(fetchAllServersThunk());
        // dispatch(fetchChannelsForServerIdThunk(activeServerId))
        dispatch(fetchCurrentUser())
    }, [dispatch])


    if (!currentUser[0]?.id) {
        return (
            <>
                <SignupFormPage />
            </>
        )
    } else {
        return (
            <main className={styles.body}> 
                <ServerNav 
                    servers={servers} 
                    setActiveServerId={setActiveServerId} 
                    activeServer={activeServer}
                    activeChannelId={activeChannelId}
                    setPrevChannelId={setPrevChannelId}
                />
                <section className={styles.main}>
                    <div className={styles.channel_view}>
                        <ServerView
                            activeServerId={activeServerId}
                            activeServer={activeServer}
                            currentUser={currentUser}
                            activeChannelId={activeChannelId}
                            setActiveChannelId={setActiveChannelId}
                            prevChannelId={prevChannelId}
                            setPrevChannelId={setPrevChannelId}
                        />
                    </div>
                </section>
            </main>
        )
    }
}