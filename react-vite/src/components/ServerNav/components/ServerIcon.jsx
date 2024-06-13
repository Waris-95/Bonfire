// import styles from "./ServerIcon.module.css"

// export default function ServerIcon({ image, id, setActiveServerId }){
//     return (
//         <div className={styles.container} onClick={() => setActiveServerId(id)}>
//             <img className={styles.image} src={image} />
//         </div>
//     )
// }

import styles from "./ServerIcon.module.css"

export default function ServerIcon({ image, id, setActiveServerId, activeChannelId, setPrevChannelId }){
    const handleChangeChannel = () => {
        setPrevChannelId(activeChannelId);
        setActiveServerId(id)
    }

    return (
        <div className={styles.container} onClick={handleChangeChannel}>
            <img className={styles.image} src={image} />
        </div>
    )
}