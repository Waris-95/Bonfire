import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMessageThunk, fetchChannelMessagesThunk, updateMessageThunk, deleteMessageThunk, addMessageReactionThunk } from '../../redux/message';
import Message from '../Message/Message';
import styles from './MessageInput.module.css';
import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
let socket;
const MessageInput = ({ channelId, defaultMessages }) => {
  const dispatch = useDispatch();
//   const messages = useSelector(state => Object.values(state.messages[channelId] || {}));
  const [messages, setMessages] = useState([...defaultMessages])
  const [message, setMessage] = useState('');


  useEffect(() => {
    setMessages(defaultMessages);
    console.log(messages)
  }, [defaultMessages])

  useEffect(() => {
    if (channelId) {
      dispatch(fetchChannelMessagesThunk(channelId));
    }
  }, [dispatch, channelId]);
  
    useEffect(() => {
        socket = io(URL);
        socket.on('chat', (data) => {
            const { text_field: text, user, date } = data;
            const newMessage = {
                channel_id: channelId,
                created_at: date,
                updated_at: date,
                message_id: defaultMessages.length + 1,
                text_field: text,
                user
            }

            setMessages(messages => [...messages, newMessage])
        })

        return (() => {
            socket.disconnect()
        })
    }, []);
            
    useEffect(() => {
        // socket.emit('leave', { room: prevRoom })
        socket.emit('join', { room: channelId })
        setMessages(messages)
    }, [channelId])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (channelId && message.trim()) {
      dispatch(createMessageThunk(channelId, { text_field: message }));
      setMessage('');
    }
  };

  const handleAddReaction = (messageId, reaction) => {
    dispatch(addMessageReactionThunk(messageId, 'channel_message', reaction));
  };

//   const handleSendMessage = (e, text_field) => {
//     e.preventDefault()
//     dispatch(createMessageThunk(channelId, text_field, currentUser.id))
//     socket.emit('chat', { text_field, room: channelId, user: currentUser, date: new Date() });
//   }

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        {messages.map((m) => (
          <Message
            key={m.message_id}
            message={m}
            onAddReaction={handleAddReaction}
          />
        ))}
      </div>
      <div className={styles.message_input_container}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.message_input}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} className={styles.send_button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;