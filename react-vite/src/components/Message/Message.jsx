import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMessageReactionThunk } from '../../redux/message';
import styles from './Message.module.css';

const Message = ({ message, onEdit, onDelete }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message.text_field);

    const handleEdit = () => {
        if (isEditing) {
            onEdit(message.id, editedText);
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        onDelete(message.id);
    };

    const handleAddReaction = (e) => {
        if (e.key === 'Enter') {
            dispatch(addMessageReactionThunk(message.id, 'channel_message', e.target.value));
            e.target.value = '';
        }
    };

    return (
        <div className={styles.message}>
            <img className={styles.profile_picture} src={message.user.profile_images[0]?.url || 'default-profile-pic-url'} alt="Profile" />
            <div>
                <div className={styles.userDetails}>
                    <h5 className={styles.userName}>{message.user.username}</h5>
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
                    {message.reactions.map((reaction) => (
                        <span key={reaction.id}>{reaction.emoji} ({reaction.count})</span>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Add reaction..."
                    onKeyDown={handleAddReaction}
                    className={styles.reaction_input}
                />
            </div>
        </div>
    );
};

export default Message;
