import { useModal } from '../../context/Modal';
import styles from './ModalStyles.module.css'; // Import the CSS module

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  disableModal, // optional: disables the modal button if set to true
  className, // optional: additional class names for the button
  id // optional: id for the button
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return (
    <button
      disabled={disableModal}
      onClick={onClick}
      className={`${styles['OpenModalButton-button']} ${className}`}
      id={id}
    >
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
