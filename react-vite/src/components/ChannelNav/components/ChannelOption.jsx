import styles from "./ChannelOption.module.css"

export default function ChannelOption({id, name, setActiveChannel, active}){
    const activeStyle = active ? {"background": "#37393f"} : {}
    console.log("CHANNEL OPTION DATA", id, name, setActiveChannel, active)

    return (
        <div className={styles.container} onClick={() => setActiveChannel(id)} style={activeStyle}>
            <h1 className={styles.text}>{name.toLowerCase()}</h1>
        </div>
    )
}