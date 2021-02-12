import { useContext } from "react";
import { Modal } from "react-bootstrap";
import GlobalAppContext from "../../context/GlobalContext";
import { useModalInfo, useModalVisible } from "../../context/hooks";

export const InfoModal = () => {
  const GlobalContext = useContext(GlobalAppContext);
  const modalVisible = useModalVisible();
  const info = useModalInfo();

  return (
    <Modal
      show={modalVisible}
      backdrop="static"
      onHide={GlobalContext.resetModalAndClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{info.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        dangerouslySetInnerHTML={{
          __html: info.body,
        }}
      ></Modal.Body>
      <Modal.Footer>{info.footer}</Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
