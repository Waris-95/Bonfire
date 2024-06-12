import { useState, useEffect } from 'react';
import Reactions from '../Reactions/Reactions';
import styles from './Message.module.css';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import { fetchMessageReactionsThunk, updateMessageThunk, deleteMessageThunk } from "../../redux/message"
import { useDispatch, useSelector } from "react-redux"

const Message = ({ message }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message?.text_field || '');
    const currUser = Object.values(useSelector((state) => state.currentUser))[0];
    let reactions = useSelector((state) => state.reactions[message?.message_id])

    useEffect(() => {
        dispatch(fetchMessageReactionsThunk(message?.message_id))
        // dispatch(fetchCurrentUser())
    }, [dispatch, message?.message_id])

    const handleEdit = () => {
        if (isEditing) {
            dispatch(updateMessageThunk(message.id, newText, channelId));
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        dispatch(deleteMessageThunk(message.id, channelId));
    };

    const userReactions = [];
    const currUserReactions = (userId) => {
        for (let emoji in reactions) {
            reactions[emoji].forEach(data => {
                if (data.user_id === userId) {
                    userReactions.push(data)
                }
            })
        }
    }

    currUserReactions(currUser?.id)

    const profileImage = message?.user?.profile_images?.[0]?.url || 'default-profile-pic-url';

    if (!message) {
        return null;
    }
    return (
        <div className={styles.message}>
            <img className={styles.profile_picture} src={profileImage} alt="Profile" />
            <div>
                <div className={styles.userDetails}>
                    <h5 className={styles.userName}>{message.user ? message.user.username : 'Unknown User'}</h5>
                    <p className={styles.date}>{new Date(message.created_at).toLocaleString()}</p>
                    <button onClick={handleEdit} disabled={message?.user?.id !== currUser?.id}  className={styles.edit_button}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button onClick={handleDelete} className={styles.delete_button} disabled={message?.user?.id !== currUser?.id}>
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
                    {reactions && Object.entries(reactions).map((reaction, index) => (
                    <>
                        <span key={index}>{reaction[0]} ({reaction[1].length})</span>
                    </>
                    ))}
                </div>
                <OpenModalButton 
                    buttonText="Add reaction..."
                    modalComponent={<Reactions type="Add" message={message} reactions={userReactions}/>}
                />
                <OpenModalButton 
                    buttonText="Delete reaction..."
                    disableModal={userReactions.length === 0 && true}
                    modalComponent={<Reactions type="Remove" reactions={userReactions} />}
                />
            </div>
        </div>
    );
}

export default Message;
