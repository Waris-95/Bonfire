// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import Reactions from '../Reactions/Reactions';
// import styles from './Message.module.css';
// import OpenModalButton from '../OpenModalButton/OpenModalButton';
// import { updateMessageThunk, deleteMessageThunk, addMessageReactionThunk } from '../../redux/message';

// // const Message = ({ message, onEdit, onDelete }) => {
// //     console.log("WHAT IS MESSAGE???", message)
// //     const dispatch = useDispatch();
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [editedText, setEditedText] = useState(message?.text_field || '');

// //     const handleEdit = () => {
// //         if (isEditing) {
// //             onEdit(message.message_id, editedText);
// //         }
// //         setIsEditing(!isEditing);
// //     };

// //     const handleDelete = () => {
// //         onDelete(message.message_id);
// //     };

// //     const handleAddReaction = (e) => {
// //         if (e.key === 'Enter') {
// //             dispatch(addMessageReactionThunk(message.message_id, 'channel_message', e.target.value));
// //             e.target.value = '';
// //         }
// //     };

// //     const profileImage = message?.user?.profile_images?.[0]?.url || 'default-profile-pic-url';

// //     if (!message) {
// //         return null;
// //     }

// export default function Message({ img = "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg", message, channelId}){
//     const dispatch = useDispatch();
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedText, setEditedText] = useState(message?.text_field || '');

//     // const handleEdit = () => {
//     //     if (isEditing) {
//     //         onEdit(message.message_id, editedText);
//     //     }
//     //     setIsEditing(!isEditing);
//     // };

//     // const handleDelete = () => {
//     //     onDelete(message.message_id);
//     // };

//     // const handleAddReaction = (e) => {
//     //     if (e.key === 'Enter') {
//     //         dispatch(addMessageReactionThunk(message.message_id, 'channel_message', e.target.value));
//     //         e.target.value = '';
//     //     }
//     // };

//     const handleEdit = (messageId, newText) => {
//         dispatch(updateMessageThunk(messageId, newText, channelId));
//     };

//     const handleDelete = (messageId) => {
//         dispatch(deleteMessageThunk(messageId, channelId));
//     };

//     const handleAddReaction = (messageId, reaction) => {
//         dispatch(addMessageReactionThunk(messageId, 'channel_message', reaction));
//     };

//     return (
//         <div className={styles.message}>
//             <img className={styles.profile_picture} src={img} alt="Profile" />
//             <div>
//                 <div className={styles.userDetails}>
//                     <h5 className={styles.userName}>{message.user ? message.user.username : 'Unknown User'}</h5>
//                     <p className={styles.date}>{new Date(message.created_at).toLocaleString()}</p>
//                     <button onClick={handleEdit} className={styles.edit_button}>
//                         {isEditing ? 'Save' : 'Edit'}
//                     </button>
//                     <button onClick={handleDelete} className={styles.delete_button}>
//                         Delete
//                     </button>
//                 </div>
//                 {isEditing ? (
//                     <input
//                         type="text"
//                         value={editedText}
//                         onChange={(e) => setEditedText(e.target.value)}
//                         className={styles.edit_input}
//                     />
//                 ) : (
//                     <p className={styles.textBody}>{message.text_field}</p>
//                 )}
//                 <div className={styles.reactions}>
//                     {message.reactions && message.reactions.map((reaction) => (
//                         <span key={reaction.id}>{reaction.emoji} ({reaction.count})</span>
//                     ))}
//                 </div>
//                 <input
//                     type="text"
//                     placeholder="Add reaction..."
//                     onKeyDown={handleAddReaction}
//                     className={styles.reaction_input}
//                 />
//                 <OpenModalButton
//                     buttonText="Add reaction..."
//                     modalComponent={<Reactions message={message}/>}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Message;

// import styles from "./Message.module.css"
// import { formatDate } from "./utils/utils"

// export default function Message({ text, date, name, img = "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg"}){
//     // console.log("Message MESSAGE TEXT, DATE, and NAME:", text, date, name)
//     return (
//         <article className={styles.message}>
//             <img className={styles.profile_picture} src={img} />
//             <div>
//                 <div className={styles.userDetails}>
//                     <h5 className={styles.userName}>{name}</h5>
//                     <p className={styles.date}>{formatDate(date)}</p>
//                 </div>
//                 <p className={styles.textBody}>{text}</p>
//             </div>
//         </article>
//     )
// }


import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMessageReactionThunk } from '../../redux/message';
import Reactions from '../Reactions/Reactions';
import styles from './Message.module.css';
import OpenModalButton from '../OpenModalButton/OpenModalButton';

const Message = ({ message, onEdit, onDelete }) => {
    console.log("WHAT IS MESSAGE???", message)
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message?.text_field || '');

    const handleEdit = () => {
        if (isEditing) {
            onEdit(message.message_id, editedText);
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        onDelete(message.message_id);
    };

    const handleAddReaction = (e) => {
        if (e.key === 'Enter') {
            dispatch(addMessageReactionThunk(message.message_id, 'channel_message', e.target.value));
            e.target.value = '';
        }
    };

    const profileImage = message?.user?.profile_images?.[0]?.url || 'default-profile-pic-url';

    if (!message) {
        return null;
    }

    return (
        <div className={styles.message}>
            {console.log("MESSAGE REACTIONS", message.reactions)}
            <img className={styles.profile_picture} src={profileImage} alt="Profile" />
            <div>
                <div className={styles.userDetails}>
                    <h5 className={styles.userName}>{message.user ? message.user.username : 'Unknown User'}</h5>
                    <p className={styles.date}>{new Date(message.created_at).toLocaleString()}</p>
                    <button onClick={handleEdit} className={styles.edit_button}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button onClick={handleDelete} className={styles.delete_button}>
                        Delete
                    </button>
                </div>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className={styles.edit_input}
                    />
                ) : (
                    <p className={styles.textBody}>{message.text_field}</p>
                )}
                <div className={styles.reactions}>
                    {message.reactions && message.reactions.map((reaction) => (
                        <span key={reaction.id}>{reaction.emoji} ({reaction.count})</span>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Add reaction..."
                    onKeyDown={handleAddReaction}
                    className={styles.reaction_input}
                />
                <OpenModalButton
                    buttonText="Add reaction..."
                    modalComponent={<Reactions message={message}/>}
                />
            </div>
        </div>
    );
};

export default Message;