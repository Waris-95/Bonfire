import styles from "./HeaderInfo.module.css"
import { useSelector } from 'react-redux';
import { FaCode } from "react-icons/fa"
import { FaGear } from "react-icons/fa6";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import NewServerModal from "../NewServerModal/NewServerModal";
import SignOutModal from "../SignOutModal/SignOutModal";

export default function HeaderInfo({ activeServer, activeChannel }){
    // const server = useSelector(state=>state.servers[`${activeServerId}`]);

    return (
        <header className={styles.headerInfo}>
            <FaCode />
            <h3 className={styles.headerTitle}>{ activeChannel?.name || "Loading..." }</h3>
            <OpenModalButton
                buttonText={<FaGear />}
                modalComponent={<NewServerModal server={activeServer} formType="Update Server"/>}
            />
            <OpenModalButton
                buttonText="Sign Out"
                modalComponent={<SignOutModal/>}
            />
        </header>
    )
}