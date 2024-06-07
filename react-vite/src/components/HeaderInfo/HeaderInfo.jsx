import styles from "./HeaderInfo.module.css"
import { useSelector } from 'react-redux';
import { FaCode } from "react-icons/fa"
import { FaGear } from "react-icons/fa6";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import NewServerModal from "../NewServerModal/NewServerModal";

export default function HeaderInfo({ activeServerId }){
    console.log("ACTIVE SERVER ID", activeServerId)
    const server = useSelector(state=>state.servers[`${activeServerId}`]);
    console.log("ACTIVE SERVER INFO", server)

    return (
        <header className={styles.headerInfo}>
            <FaCode />
            <h3 className={styles.headerTitle}>Channel Name</h3>
            <OpenModalButton
                buttonText={<FaGear />}
                modalComponent={<NewServerModal server={server} formType="Update Server"/>}
            />
        </header>
    )
}