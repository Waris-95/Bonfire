import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createMessageThunk, fetchChannelMessagesThunk } from '../../redux/message';
import styles from './MessageInput.module.css';
import Message from '../Message/Message';

const ChatRoom = ({ channelId = 1, messages = [], handleSendMessage, handleLeave }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Channel ID:', channelId);
    if (channelId) {
      dispatch(fetchChannelMessagesThunk(channelId));
    }
  }, [dispatch, channelId]);

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendOnClick = () => {
    console.log('Sending message:', message);
    if (channelId && message.trim()) {
      handleSendMessage(message);
      setMessage('');
    }
  };

  const handleLeaveOnClick = () => {
    handleLeave();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.chat_room}>
        <input type='text' value={message} onChange={handleOnChange} />
        <button type='button' onClick={handleSendOnClick}>Send</button>
        <button type='button' onClick={handleLeaveOnClick}>Leave</button>
      </div>
      <div className={styles.messages}>
        {messages.map((m, index) => (
          <Message
            key={`${m.id}-${index}`}
            username={m.username}
            date={new Date(m.created).toLocaleTimeString()}
            textBody={m.text_field}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
