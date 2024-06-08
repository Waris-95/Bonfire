import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styles from "./Message.module.css";
import { formatDate } from "./utils/utils";
import { fetchMessageReactionsThunk, addMessageReactionThunk } from '../../redux/message';

export default function Message({ message, onEdit, onDelete }) {
    if (!message) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message.text_field);
    const [reaction, setReaction] = useState('');
    const dispatch = useDispatch();
    const reactions = useSelector(state => state.messages[message.message_id]?.reactions || []);

    useEffect(() => {
        dispatch(fetchMessageReactionsThunk(message.message_id));
    }, [dispatch, message.message_id]);

    const handleEdit = () => {
        if (isEditing) {
            onEdit(message.message_id, editedText);
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        onDelete(message.message_id);
    };

    const handleAddReaction = () => {
        if (reaction.trim()) {
            dispatch(addMessageReactionThunk(message.message_id, 'channel_message', reaction));
            setReaction('');
        }
    };

    return (
        <article className={styles.message}>
            <img
                className={styles.profile_picture}
                src={message.user?.profile_image?.[0]?.url || 'default-profile-pic-url'}
                alt="Profile"
            />
            <div>
                <div className={styles.userDetails}>
                    <h5 className={styles.userName}>{message.user?.username || 'Unknown User'}</h5>
                    <p className={styles.date}>{formatDate(message.created_at)}</p>
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
                    {reactions.map(reaction => (
                        <span key={reaction.id}>{reaction.emoji} ({reaction.count})</span>
                    ))}
                </div>
                
                <input
                    type="text"
                    value={reaction}
                    onChange={(e) => setReaction(e.target.value)}
                    className={styles.reaction_input}
                    placeholder="Add reaction..."
                />
                <button onClick={handleAddReaction} className={styles.reaction_button}>
                    Add Reaction
                </button>
            </div>
        </article>
    );
}

