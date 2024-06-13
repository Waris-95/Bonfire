import { useDispatch } from "react-redux"
import { addMessageReactionThunk, deleteMessageReactionThunk } from "../../redux/message"
import { useModal } from "../../context/Modal";

const Reactions = ({ message, type, reactions }) => {
    const dispatch = useDispatch();
    const emojis = ["😀","😃","😄"]
    const { closeModal } = useModal();

    const addReaction = (emoji) => {
        // e.preventDefault()
        let emojiAdded = false
        console.log("GETTING REACTIONS adding them", emoji)
        reactions.forEach(reaction => {
            if (reaction.emoji === emoji) {
                emojiAdded = true
                closeModal()
            }
        })
        if (emojiAdded === false) {
            console.log("GETTING REACTIONS adding them", emoji)
            dispatch(addMessageReactionThunk(message.message_id, 'channel_message', emoji))
            closeModal()
        }

    }

    const deleteReaction = (message_id, reaction_id) => {
        dispatch(deleteMessageReactionThunk(message_id, reaction_id))
        closeModal()
    }

    if (type === "Add") {
        return (
            <>
                {emojis.map((emoji,index) => {
                    return (
                        <button key={index} onClick={() => addReaction(emoji)}>{emoji}</button>
                    )
                })}
            </>
        )
    } else if (type === "Remove") {
        return (
            <>
                {reactions?.map((reaction, index) => {
                    return (
                        <button key={index} onClick={() => deleteReaction(reaction.channel_message_id, reaction.reaction_id)}>{reaction.emoji}</button>
                    )
                })}
            </>
        )
    }

}

export default Reactions;