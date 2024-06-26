import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchChannelsForServerIdThunk, updateOldChannel, deleteAChannel } from "../../redux/channel";

function EditChannelModal({ channel, activeServerId }) {
    const dispatch = useDispatch();
    const { name } = channel
    const [channelName, setChannelName] = useState(name);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        channel.name = channelName

        const channelResponse = await dispatch(
            updateOldChannel(channel)
        );

        if (channelResponse) {
            setErrors(channelResponse);
        } else {
            closeModal()
        }

        await dispatch(fetchChannelsForServerIdThunk(activeServerId))

    }

    const deleteChannel = async (e) => {
        e.preventDefault();

        const channelResponse = await dispatch(deleteAChannel(channel.id));
        
        if (channelResponse) {
            setErrors(channelResponse);
        } else {
            closeModal();
        }

        await dispatch(fetchChannelsForServerIdThunk(activeServerId))
    }

    return (
        <>
            <h1>Channel Settings</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Change Channel Name
                    <input
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Create Channel</button>
            </form>
            <form onSubmit={deleteChannel}>
                <button type="submit">Delete Channel</button>
            </form>
            {errors.error && <p>Only the channel owner may update or delete the channel.</p>}
        </>
    )
}

export default EditChannelModal;