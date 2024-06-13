import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { useModal } from "../../context/Modal";

function SignOutModal() {
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const handleSignOut = (e) => {
        e.preventDefault()
        dispatch(thunkLogout(() => {
            closeModal()
            window.location.href = '/';
        }))
    }

    return(
        <>
            <h2>Sure you want to leave?</h2>
            <button onClick={handleSignOut}>Yes</button>
            <button onClick={() => closeModal()}>No</button>
        </>
    )
}

export default SignOutModal;