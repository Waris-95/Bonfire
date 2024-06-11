import { useState } from "react";
import { useDispatch } from "react-redux"
import { addMessageReactionThunk, deleteMessageReactionThunk } from "../../redux/message"
import { useModal } from "../../context/Modal";

const Reactions = ({ message, type, reactions }) => {
    const dispatch = useDispatch();
    const emojis = ["😀","😃","😄"]
    const { closeModal } = useModal();
    const [userReactions] = useState(reactions)
    console.log("DID USER REACTIONS MAKE IT???", userReactions)
    const addReaction = (emoji) => {
        console.log("EMOJI???", emoji)
        dispatch(addMessageReactionThunk(message.message_id, 'channel_message', emoji))
        closeModal()

    }

    const deleteReaction = (messageId, reactionId) => {
        dispatch(deleteMessageReactionThunk(messageId, reactionId))
        closeModal()
    }

    if (type === "Add") {
        return (
            <>
                {emojis.map((emoji, index) => {
                    return (
                        <button key={index} onClick={() => addReaction(emoji)}>{emoji}</button>
                    )
                })}
            </>
        )
    } else if (type === "Remove") {
        return (
            <>
                {console.log("REACTIONS MAP", reactions)}
                {userReactions?.map((reaction, index) => {
                    return (
                        <button key={index} onClick={() => deleteReaction(reaction.channel_message_id, reaction.id)}>{reaction.emoji}</button>
                    )
                })}
            </>
        )
    }

}

export default Reactions;