import { useDispatch } from "react-redux";
import { addMessageReactionThunk, deleteMessageReactionThunk } from "../../redux/message";
import { useModal } from "../../context/Modal";
import styles from "./Reactions.module.css";

const Reactions = ({ message, type, reactions }) => {
    const dispatch = useDispatch();
    const emojis = ["😀", "😃", "😄"];
    const { closeModal } = useModal();

    const addReaction = (emoji) => {
        let emojiAdded = false;
        reactions.forEach(reaction => {
            if (reaction.emoji === emoji) {
                emojiAdded = true;
                closeModal();
            }
        });
        if (!emojiAdded) {
            dispatch(addMessageReactionThunk(message.message_id, 'channel_message', emoji));
            closeModal();
        }
    };

    const deleteReaction = (message_id, reaction_id) => {
        dispatch(deleteMessageReactionThunk(message_id, reaction_id));
        closeModal();
    };

    if (type === "Add") {
        return (
            <div className={styles.reactionsContainer}>
                {emojis.map((emoji, index) => (
                    <button key={index} onClick={() => addReaction(emoji)} className={styles.reactionButton}>
                        {emoji}
                    </button>
                ))}
            </div>
        );
    } else if (type === "Remove") {
        return (
            <div className={styles.reactionsContainer}>
                {reactions?.map((reaction, index) => (
                    <button key={index} onClick={() => deleteReaction(reaction.channel_message_id, reaction.id)} className={styles.reactionButton}>
                        {reaction.emoji}
                    </button>
                ))}
            </div>
        );
    }
};

export default Reactions;
