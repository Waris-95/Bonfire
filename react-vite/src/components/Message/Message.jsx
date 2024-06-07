import { FaUserCircle } from 'react-icons/fa';
import styles from './Message.module.css';
import { useState } from 'react';

const Message = ({ message, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message?.textBody || '');

  const handleEdit = () => {
    if (isEditing) {
      onEdit(message.id, editedText);
    }
    setIsEditing(!isEditing);
  };

  if (!message) {
    return null; // or show a placeholder
  }

  return (
    <div className={styles.message}>
      <div className={styles.avatar}>
        <FaUserCircle size={40} />
      </div>
      <div className={styles.content}>
        <div>
          <span className={styles.username}>{message.username || 'Unknown User'}</span>
          <span className={styles.timestamp}>{message.date || 'Unknown Date'}</span>
          <button onClick={handleEdit} className={styles.edit_button}>
            {isEditing ? 'Save' : 'Edit'}
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
          <div className={styles.text}>{message.textBody}</div>
        )}
      </div>
    </div>
  );
};

export default Message;
