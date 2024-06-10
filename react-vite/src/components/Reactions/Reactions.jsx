import { useDispatch } from "react-redux"
import { addMessageReactionThunk } from "../../redux/message"
import { useModal } from "../../context/Modal";

const Reactions = ({ message }) => {
    const dispatch = useDispatch();
    const emojis = ["😀","😃","😄"]
    const { closeModal } = useModal();

    const addReaction = (emoji) => {
        // e.preventDefault()
        console.log("EMOJI???", emoji)
        dispatch(addMessageReactionThunk(message.message_id, 'channel_message', emoji))
        closeModal()

    }
    return (
        <>
            {emojis.map((emoji,index) => {
                return (
                    <button key={index} onClick={() => addReaction(emoji)}>{emoji}</button>
                )
            })}
        </>
    )
}

export default Reactions;