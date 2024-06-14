// import styles from "./ChannelNav.module.css"
// // Util
// import { useMemo } from "react"
// // Components
// import { FaCode } from "react-icons/fa"
// import ChannelOption from "./components/ChannelOption"
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
// import ChannelModal from "../ChannelModal/ChannelModal";
// import EditChannelModal from "../EditChannelModal/EditChannelModal";
// import { GoPlus } from "react-icons/go";
// import { FaGear } from "react-icons/fa6";

// export default function ChannelNav({ channels, activeChannel, setActiveChannel, setPrevChannel, activeServer, activeServerId, currentUser, currentServerOwner }){
//     const channelElements = useMemo(() => channels.map(channel => (
//         <>
//             <ChannelOption id={channel.id} key={channel.id} name={channel.name} activeChannelId={activeChannel?.id} setActiveChannel={setActiveChannel} />
//             {(channel.owner_id === currentUser[0]?.id || currentServerOwner === currentUser[0]?.id) && <OpenModalButton
//                         buttonText={<FaGear />}
//                         modalComponent={<EditChannelModal activeServerId={activeServerId} channel={channel}/>}
//                     />}
//         </>
//     )), [channels, setActiveChannel, activeServerId, currentUser, currentServerOwner])

//     return (
//         <aside className={styles.channelNav}>
//             <div className={styles.channelName}>
//                 <FaCode className={styles.channelName__logo}/>
//                 <h1 className={styles.channelName__header}>{activeServer?.name || "Loading..."}</h1>
//             </div>
//             <div>
//                 Text Channels
//                 <OpenModalButton
//                     buttonText={<GoPlus />}
//                     modalComponent={<ChannelModal activeServerId={activeServerId}/>}
//                 />
//             </div>
//             <div className={styles.channelOptions}>
//                 {channelElements}
//             </div>
//         </aside>
//     )
// }

import styles from "./ChannelNav.module.css"
// Util
import { useMemo, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// Components
import { FaCode } from "react-icons/fa"
import ChannelOption from "./components/ChannelOption"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import ChannelModal from "../ChannelModal/ChannelModal";
import EditChannelModal from "../EditChannelModal/EditChannelModal";
import { fetchChannelsForServerIdThunk } from "../../redux/channel"
import { GoPlus } from "react-icons/go";
import { FaGear } from "react-icons/fa6";

export default function ChannelNav({ channels, activeChannel, setActiveChannel, setPrevChannel, activeServer, currentUser }){
    const channelsRedux = Object.values(useSelector((state) => state.channels))
    const [channelState, setChannelState] = useState(channels)
    console.log("CHANNELS INITIAL", channels)
    console.log("CHANNELS REDUX", channelsRedux)
    console.log("CHANNELS STATE", channelState)

    const channelElements = useMemo(() => channelsRedux?.map(channel => (
        <>
            <ChannelOption id={channel.id} key={channel.id} name={channel.name} activeChannelId={activeChannel?.id} setActiveChannel={setActiveChannel} setPrevChannel={setPrevChannel} active={channel.id === activeChannel?.id}/>
            {(channel.owner_id === currentUser[0]?.id || activeServer?.owner_id === currentUser[0]?.id) && <OpenModalButton
                buttonText={<FaGear />}
                modalComponent={<EditChannelModal activeServerId={activeServer?.id} channel={channel}/>}
            />}
        </>
    )), [channelsRedux, activeChannel, setActiveChannel, setPrevChannel, currentUser, activeServer?.id, activeServer?.owner_id])

    useEffect(() => {
        setChannelState(channels)
        // fetchChannelsForServerIdThunk(activeServer?.id)
    }, [channels, activeServer?.id])

    return (
        <aside className={styles.channelNav}>
            <div className={styles.channelName}>
                <FaCode className={styles.channelName__logo}/>
                <h1 className={styles.channelName__header}>{activeServer?.name || "Loading..."}</h1>
            </div>
            <div>
                Text Channels
                <OpenModalButton
                    buttonText={<GoPlus />}
                    modalComponent={<ChannelModal
                                        serverChannels={channelsRedux}
                                        activeServerId={activeServer?.id}/>}
                                    />
            </div>
            <div className={styles.channelOptions}>
                {channelElements}
            </div>
        </aside>
    )
}