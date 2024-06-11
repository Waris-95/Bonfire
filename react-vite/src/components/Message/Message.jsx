import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageReactionsThunk } from '../../redux/message';
import { fetchCurrentUser } from '../../redux/serverUser';
import Reactions from '../Reactions/Reactions';
import styles from './Message.module.css';
import OpenModalButton from '../OpenModalButton/OpenModalButton';

const Message = ({ message, onEdit, onDelete }) => {
    console.log("WHAT IS MESSAGE???", message)
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message?.text_field || '');
    const reactions = Object.values(useSelector((state) => state.reactions))
    const currentUser = Object.values(useSelector((state) => state.currentUser));
    console.log("DID THE CURRENT USER MAKE IT TO THE MESSAGE???", currentUser[0])
    console.log("WHAT DO THESE REACTIONS LOOK LIKE???", reactions)

    useEffect(() => {
        dispatch(fetchMessageReactionsThunk(message?.message_id))
        dispatch(fetchCurrentUser())

    }, [dispatch, message?.message_id])

    const userReactions = [];
    const currUsersReactions = (userId) => {
        reactions.map(reaction => {
            console.log("COMPARING USER ID WITH REACTION USER ID", userId, reaction.user_id, userId === reaction.user_id)
            if (userId === reaction.user_id) {
                userReactions.push(reaction)
            }

            console.log("USERS REACTIONS", userReactions)
            return userReactions;
        })
    }

    currUsersReactions(currentUser[0]?.id)

    const handleEdit = () => {
        if (isEditing) {
            onEdit(message.message_id, editedText);
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        onDelete(message.message_id);
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
                    {reactions && reactions.map((reaction) => (
                        <span key={reaction.id}>{reaction.emoji} ({reaction.count})</span>
                    ))}
                </div>
                <OpenModalButton
                    buttonText="Add reaction..."
                    modalComponent={<Reactions type="Add" message={message}/>}
                />
                <OpenModalButton
                    buttonText="Delete reaction..."
                    modalComponent={<Reactions type="Remove" reactions={userReactions} />}
                />
            </div>
        </div>
    );
};

export default Message;
