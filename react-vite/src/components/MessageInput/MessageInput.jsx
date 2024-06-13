// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createMessageThunk, fetchChannelMessagesThunk, updateMessageThunk, deleteMessageThunk, addMessageReactionThunk } from '../../redux/message';
// import Message from '../Message/Message';
// import styles from './MessageInput.module.css';

// const MessageInput = ({ channelId }) => {
//   const dispatch = useDispatch();
//   const messages = useSelector(state => Object.values(state.messages[channelId] || {}));
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (channelId) {
//       dispatch(fetchChannelMessagesThunk(channelId));
//     }
//   }, [dispatch, channelId]);

//   const handleSendMessage = (e) => {
//     e.preventDefault()

//     if (channelId && message.trim()) {
//       dispatch(createMessageThunk(channelId, { text_field: message }));
//       setMessage('');
//     }
//   };

//   const handleEditMessage = (messageId, newText) => {
//     dispatch(updateMessageThunk(messageId, newText, channelId));
//   };

//   const handleDeleteMessage = (messageId) => {
//     dispatch(deleteMessageThunk(messageId, channelId));
//   };

//   const handleAddReaction = (messageId, reaction) => {
//     dispatch(addMessageReactionThunk(messageId, 'channel_message', reaction));
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.messages}>
//         {messages.map((m, index) => (
//           <Message
//             key={`${m.message_id}-${index}`}
//             message={m}
//             onEdit={handleEditMessage}
//             onDelete={handleDeleteMessage}
//             onAddReaction={handleAddReaction}
//           />
//         ))}
//       </div>
//       <div className={styles.message_input_container}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className={styles.message_input}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSendMessage} className={styles.send_button}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageInput;


import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMessageThunk, fetchChannelMessagesThunk } from '../../redux/message';
import styles from './MessageInput.module.css';

const MessageInput = ({ channelId, handleSendMessage }) => {
  const [message, setMessage] = useState('');
  const sendMessage = (e, message) => {
    handleSendMessage(e, message)
    setMessage("")
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.message_input_container}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.message_input}
                placeholder="Type a message..."
            />
            <button onClick={(e) => sendMessage(e, message)} className={styles.send_button} disabled={message.length < 1}>
                Send
            </button>
      </form>
    </div>
  );
};

export default MessageInput;