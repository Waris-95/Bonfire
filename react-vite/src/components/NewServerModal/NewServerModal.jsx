import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewServer, fetchAllServersThunk, updateOldServer, deleteAServer } from "../../redux/server";
import { useModal } from "../../context/Modal";
import styles from "./NewServerModal.module.css"

function NewServerModal({ server, formType }) {
    const dispatch = useDispatch();
    const [serverName, setServerName] = useState(server?.name);
    const [serverDescription, setServerDescription] = useState(server?.description);
    const [serverImage, setServerImage] = useState(server?.server_images[0].url);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formType === "Update Server") {
            console.log("Updating a Server")
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
            console.log("Creating a server")
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
            <h1>Create a Server</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        required
                    />
                </label>
                {errors.serverName && <p>{errors.serverName}</p>}
                <label>
                    Description
                    <input
                        type="text"
                        value={serverDescription}
                        onChange={(e) => setServerDescription(e.target.value)}
                    />
                </label>
                {errors.serverDescription && <p>{errors.serverDescription}</p>}
                <label>
                    Server Image
                    <input
                        type="text"
                        value={serverImage}
                        onChange={(e) => setServerImage(e.target.value)}
                    />
                </label>
                {errors.serverImage && <p>{errors.serverImage}</p>}
                <button type="submit">{formType === "Update Server" ? "Update Server" : "Create Server"}</button>
            </form>
            <form onSubmit={deleteServer}>
                <button type="submit" className={formType !== "Update Server" ? styles.hidden : ""}>Delete Server</button> 
            </form>
        </>
    )
}

export default NewServerModal;