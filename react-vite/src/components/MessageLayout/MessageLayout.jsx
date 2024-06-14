import styles from "./MessageLayout.module.css"
// Util
import { useMemo, useEffect, useState, useRef } from "react"
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { createMessageThunk, fetchChannelMessagesThunk, updateMessageThunk, deleteMessageThunk } from "../../redux/message";


// Components
import Message from "../Message/Message"
import MessageInput from "../MessageInput/MessageInput"

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
let socket;
export default function MessageLayout({ defaultMessages, channelId, prevChannelId, currentUser }) {
    const dispatch = useDispatch()
    // const currentUser = Object.values(useSelector((state) => state.currentUser))[0];
    const [messages, setMessages] = useState(defaultMessages)
    console.log("GET ALL MESSAGES messagelayout", defaultMessages)
    console.log("GET ALL MESSAGES messagelayout", messages)

    // useEffect(() => {
    //     setMessages(defaultMessages)
    // }, [defaultMessages])

    useEffect(() => {
        socket = io(URL);
        socket.on('chat', (data) => {
            // const { text_field: text, user, date } = data;
            // const newMessage = {
            //     channel_id: channelId,
            //     created_at: date,
            //     updated_at: date,
            //     message_id: defaultMessages.length + 1,
            //     text_field: text,
            //     user
            // }

            // setMessages(messages => [...messages, newMessage])
            dispatch(fetchChannelMessagesThunk(data.room))
            // setTimeout(() => {
            //     dispatch(fetchChannelMessagesThunk(data.room));
            // }, 100);
        })

        return (() => {
            socket.disconnect()
        })
    }, [dispatch]);

    // useEffect(() => {
    //     const fetchMessages = () => {
    //         dispatch(fetchChannelMessagesThunk(channelId));
    //     };
    
    //     const intervalId = setInterval(fetchMessages, 5000);
    
    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, [dispatch, channelId]);

    useEffect(() => {
        socket.emit('leave', { room: prevChannelId })
        socket.emit('join', { room: channelId })
        setMessages(defaultMessages)
    }, [channelId, prevChannelId, defaultMessages])

    const handleSendMessage = (e, text_field) => {
        e.preventDefault()
        dispatch(createMessageThunk(channelId, text_field, currentUser.id))
        socket.emit('chat', { text_field, room: channelId, user: currentUser, date: new Date() });
    }

    // const handleEditMessage = (messageId, newText, channelId) => {
    //     console.log("EDIT MESSAGE", messageId, newText, channelId)
    //     dispatch(updateMessageThunk(messageId, newText, channelId));
    // }

    // const handleDeleteMessage = (messageId) => {
    //     dispatch(deleteMessageThunk(messageId, channelId));
    // }

    const messageElements = useMemo(() => messages.map((message) => {
        console.log("GET ALL MESSAGES one message", message)
        const { user } = message;
        const handleEditMessage = (messageId, newText, channelId) => {
            dispatch(updateMessageThunk(messageId, newText, channelId));
        }
    
        const handleDeleteMessage = (messageId) => {
            dispatch(deleteMessageThunk(messageId, channelId));
        }
        const url = user?.profile_images[0]?.url || undefined
        return <Message key={message.id} message={message} text={message.text_field} date={message.updated_at} name={message.user?.username} img={url} currentUser={currentUser} onEdit={handleEditMessage} onDelete={handleDeleteMessage} />
    }), [messages, currentUser, channelId, dispatch])

    const containerRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom whenever the messages array changes
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);


    return (
        <div className={styles.main}>
            <div className={styles.messages} ref={containerRef}>
                {messageElements}
                {/* <button onClick={sendChat}>Click</button> */}
            </div>
            <MessageInput channelId={channelId} handleSendMessage={handleSendMessage} />
        </div>
    )
}