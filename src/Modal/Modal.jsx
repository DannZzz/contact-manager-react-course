import React from "react";
import { useContext } from "react";
import _Modal from "react-modal";
import { ModalContext } from "../Context/ModalContext";
import "./Modal.scss";

_Modal.setAppElement("body");

const Modal = () => {
  const { modal, dispatch } = useContext(ModalContext);
  return (
    <_Modal
      className="custom-modal"
      isOpen={modal.isOpen}
      onAfterOpen={modal.onAfterOpen}
      contentLabel={modal.contentLabel}
      onRequestClose={() => {
        dispatch({ isOpen: false });
      }}
    >
      {modal.content}
    </_Modal>
  );
};

export default Modal;
