import styles from "./MessageLayout.module.css"
// Util
import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { createMessageThunk } from "../../redux/message";


// Components
import MessageInput from "../MessageInput/MessageInput"

export default function MessageLayout({ channelId, defaultMessages }) {

                                                                
    return (
        <div className={styles.main}>
            {/* <div className={styles.messages} ref={containerRef}>
                {/* {messageElements} */}
                {/* <button onClick={sendChat}>Click</button> */}
            {/* </div>  */}
            <MessageInput channelId={channelId} defaultMessages={defaultMessages} />
        </div>
    )
}