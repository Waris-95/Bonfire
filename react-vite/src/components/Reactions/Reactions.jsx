import { useDispatch } from "react-redux"
import { addMessageReactionThunk, deleteMessageReactionThunk } from "../../redux/message"
import { useModal } from "../../context/Modal";

const Reactions = ({ message, type, reactions }) => {
    console.log("Reaction Component checking reactions", reactions)
    const dispatch = useDispatch();
    const emojis = ["😀","😃","😄"]
    // const addedEmojis = Object.keys(reactions)
    const { closeModal } = useModal();

    const addReaction = (emoji) => {
        // e.preventDefault()
        console.log("EMOJI???", emoji)
        dispatch(addMessageReactionThunk(message.message_id, 'channel_message', emoji))
        closeModal()

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
                        <button key={index} onClick={() => deleteReaction(reaction.channel_message_id, reaction.id)}>{reaction.emoji}</button>
                    )
                })}
            </>
        )
    }

}

export default Reactions;