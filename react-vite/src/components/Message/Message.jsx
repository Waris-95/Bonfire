// import { FaUserCircle } from "react-icons/fa"
import styles from "./Message.module.css"
import { formatDate } from "./utils/utils"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import Reactions from "../Reactions/Reactions"
import { useState } from "react"

export default function Message({ message, text, date, name, img = "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg", currentUser, onEdit, onDelete}){
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message?.text_field || '');


    const handleEdit = () => {
        if (isEditing) {
            onEdit(message.message_id, editedText, message.channel_id);
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        onDelete(message.message_id);
    };

    const reactionsArray = arr => {
        const emojis = {}
        arr.forEach(v => {
            if (v.emoji in emojis) {
                emojis[v.emoji].push({
                    'emoji': v.emoji,
                    'reaction_id': v.reaction_id,
                    'user_id': v.user_reactions[0]?.user_id,
                    'channel_message_id': message.message_id
                })
            } else {
                emojis[v.emoji] = [{
                    'emoji': v.emoji,
                    'reaction_id': v.reaction_id,
                    'user_id': v.user_reactions[0]?.user_id,
                    'channel_message_id': message.message_id
                }]
            }
            
            })
        return emojis
    }

    let emojis;

    if (message?.reactions.length > 0) {
        emojis = reactionsArray(message?.reactions)
    }

    const userReactions = [];
    const currUserReactions = (userId) => {
        for (let emoji in emojis) {
            emojis[emoji].forEach(data => {
                if (data.user_id === userId) {
                    userReactions.push(data)
                }
            })
        }
    }

    currUserReactions(currentUser[0]?.id)    
    return (
        <article className={styles.message}>
            <img className={styles.profile_picture} src={img} />
            <div>
                <div className={styles.userDetails}>
                    <h5 className={styles.userName}>{name}</h5>
                    <p className={styles.date}>{formatDate(date)}</p>
                </div>
                <button onClick={handleEdit} disabled={message?.user?.id !== currentUser[0]?.id}  className={styles.edit_button}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button onClick={handleDelete} className={styles.delete_button} disabled={message?.user?.id !== currentUser[0]?.id}>
                        Delete
                    </button>
                
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
                    {emojis && Object.entries(emojis).map((reaction, index) => (
                    <>
                        <span key={index}>{reaction[0] && reaction[0]} ({reaction[1].length})</span>
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
                    modalComponent={<Reactions type="Remove" reactions={userReactions}/>}
                />
            </div>
        </article>
    )
}
