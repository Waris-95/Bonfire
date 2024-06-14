import { useEffect, useMemo, useState } from "react";
import { useDispatch } from 'react-redux';
import { fetchAllServersThunk, clearServerDetails } from '../../redux/server';
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import NewServerModal from "../NewServerModal/NewServerModal";
import styles from "./ServerNav.module.css"
import ServerIcon from "./components/ServerIcon";
// import { FaUserCircle } from "react-icons/fa"
// import { FaFireAlt, FaFire } from "react-icons/fa";
import { AiFillFire } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";

const IMAGE_PLACEHOLDER = "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg"

export default function ServerNav({ servers, setActiveServerId, activeChannelId, setPrevChannelId }){
    const dispatch = useDispatch();
    // const [isValidImage, setIsValidImage] = useState([])

    useEffect(() => {
        dispatch(fetchAllServersThunk());

        return () => {
            dispatch(clearServerDetails());
        }
    }, [dispatch]);

    // useEffect(() => {
    //     const promises = servers.map(server => {
    //         return new Promise((resolve) => {
    //             const img = new Image();
    //             img.onload = function() {
    //                 resolve(true);
    //             };
    //             img.onerror = function() {
    //                 resolve(false);
    //             };
    //             img.src = server.server_images[0]?.url
    //         });
    //     })

    //     Promise.all(promises).then(res => {
    //         setIsValidImage(res)
    //     })
    // }, [servers])

    const serverElements = useMemo(() => servers.map((server) => {
        // return (
        //     <ServerIcon key={server.id} image={isValidImage[index] ? server?.server_images[0]?.url : IMAGE_PLACEHOLDER} id={server.id} setActiveServerId={setActiveServerId} activeChannelId={activeChannelId} setPrevChannelId={setPrevChannelId} />
        // )
        return (
            <ServerIcon key={server.id} id={server.id} setActiveServerId={setActiveServerId} activeChannelId={activeChannelId} setPrevChannelId={setPrevChannelId} />
        )
    }), [servers, setActiveServerId, activeChannelId, setPrevChannelId])

    return (
        <aside className={styles.serverNav}>
            <div className={styles.directMessageIcon}>
                <AiFillFire size={40} fill="orange"/>
            </div>
            {serverElements}

            <OpenModalButton
                buttonText={<CiCirclePlus size={44}/>}
                modalComponent={<NewServerModal/>}
            />
        </aside>
    )
}