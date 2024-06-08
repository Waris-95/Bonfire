import { useState } from "react";
import styles from "./Message.module.css";
import { formatDate } from "./utils/utils";

export default function Message({ message, onEdit, onDelete }) {
  if (!message) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text_field);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(message.message_id, editedText);
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    onDelete(message.message_id);
  };

  return (
    <article className={styles.message}>
      <img className={styles.profile_picture} src={message.user.profile_image?.[0]?.url || 'default-profile-pic-url'} alt="Profile" />
      <div>
        <div className={styles.userDetails}>
          <h5 className={styles.userName}>{message.user.username}</h5>
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
      </div>
    </article>
  );
}
