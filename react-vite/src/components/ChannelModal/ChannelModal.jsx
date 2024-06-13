import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchChannelsForServerIdThunk, addNewChannel } from "../../redux/channel";
import styles from "./ChannelModal.module.css";

function ChannelModal({ activeServerId }) {
    const dispatch = useDispatch();
    const [channelName, setChannelName] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newChannel = {
            name: channelName
        };

        const channelResponse = await dispatch(
            addNewChannel(newChannel, activeServerId)
        );

        if (channelResponse) {
            setErrors(channelResponse);
        } else {
            closeModal();
        }

        await dispatch(fetchChannelsForServerIdThunk(activeServerId));
    };

    return (
        <div className={styles.modalContainer}>
            <h1 className={styles.header}>Create a Channel</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Name
                    <input
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>
                {errors.channelName && <p className={styles.error}>{errors.channelName}</p>}
                <button type="submit" className={styles.button}>Create Channel</button>
            </form>
        </div>
    );
}

export default ChannelModal;
