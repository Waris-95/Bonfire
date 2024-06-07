import styles from "./ChannelNav.module.css"
// Util
import { useMemo } from "react"
// Components
import { FaCode } from "react-icons/fa"
import ChannelOption from "./components/ChannelOption"
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ChannelModal from "../ChannelModal/ChannelModal";
import EditChannelModal from "../EditChannelModal/EditChannelModal";
import { GoPlus } from "react-icons/go";
import { FaGear } from "react-icons/fa6";


export default function ChannelNav({ channels, setActiveChannel, activeServerId }){
    const channelElements = useMemo(() => channels.map(channel => (
        <>
            <ChannelOption id={channel.id} key={channel.id} name={channel.name} setActiveChannel={setActiveChannel} />
            <OpenModalButton
                        buttonText={<FaGear />}
                        modalComponent={<EditChannelModal activeServerId={activeServerId} channel={channel}/>}
                    />
        </>
    )), [channels, setActiveChannel, activeServerId])

    return (
        <aside className={styles.channelNav}>
            <div className={styles.channelName}>
                <FaCode className={styles.channelName__logo}/>
                <h1 className={styles.channelName__header}>Server Name</h1>
            </div>
            <div>
                Text Channels
                <OpenModalButton
                    buttonText={<GoPlus />}
                    modalComponent={<ChannelModal activeServerId={activeServerId}/>}
                />
            </div>
            <div className={styles.channelOptions}>
                {channelElements}
            </div>
        </aside>
    )
}