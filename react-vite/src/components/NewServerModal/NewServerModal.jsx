import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewServer, fetchAllServersThunk, updateOldServer, deleteAServer } from "../../redux/server";
import { useModal } from "../../context/Modal";
import styles from "./NewServerModal.module.css"

function NewServerModal({ server, formType }) {
    const dispatch = useDispatch();
    const [serverName, setServerName] = useState(server?.name);
    const [serverDescription, setServerDescription] = useState(server?.description);
    const [serverImage, setServerImage] = useState(server?.server_images[0]?.url);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formType === "Update Server") {
            console.log("UPDATE SERVER", serverImage)
            const serverResponse = await dispatch(
                updateOldServer({
                    id: server.id,
                    name: serverName,
                    description: serverDescription,
                    server_image: serverImage,
                })
            );

            if (serverResponse) {
                setErrors(serverResponse);
            } else {
                closeModal()
            }
    
            await dispatch(fetchAllServersThunk());
        } else {
            const serverResponse = await dispatch(
                addNewServer({
                    name: serverName,
                    description: serverDescription,
                    server_image: serverImage,
                })
            );
    
            if (serverResponse) {
                setErrors(serverResponse);
            } else {
                closeModal()
            }
    
            await dispatch(fetchAllServersThunk());
        }
    };

    const deleteServer = async (e) => {
        e.preventDefault();
        await dispatch(deleteAServer(server.id));
        closeModal();
        await dispatch(fetchAllServersThunk());
    }

    return (
        <>
        <div className={styles.modalLayout}>
            <h1>Create a Server</h1>
            <form onSubmit={handleSubmit} className={styles.createServerForm}>
                <input
                    type="text"
                    className={styles.serverName}
                    value={serverName}
                    placeholder={"Name"}
                    onChange={(e) => setServerName(e.target.value)}
                    required
                />
                {errors.serverName && <p>{errors.serverName}</p>}
                <textarea
                    type="text"
                    className={styles.serverDescription}
                    value={serverDescription}
                    placeholder={"Description"}
                    onChange={(e) => setServerDescription(e.target.value)}
                />
                {errors.serverDescription && <p>{errors.serverDescription}</p>}
                <input
                    type="text"
                    className={styles.serverName}
                    value={serverImage}
                    placeholder={"Image URL"}
                    onChange={(e) => setServerImage(e.target.value)}
                />
                {errors.serverImage && <p>{errors.serverImage}</p>}
                <button type="submit" className={styles.createServerButton}>{formType === "Update Server" ? "Update" : "Create"}</button>
            </form>
            <form onSubmit={deleteServer}>
                <button type="submit" className={formType !== "Update Server" ? styles.hidden : ""}>Delete Server</button> 
            </form>
        </div>
        </>
    )
}

export default NewServerModal;