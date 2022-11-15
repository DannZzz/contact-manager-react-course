import React, { useState } from "react";
import { useContext } from "react";
import { IoPersonAddOutline, IoTrashOutline } from "react-icons/io5";
import { SettingsContext } from "../Context/SettingsContext";
import { ModalContext } from "../Context/ModalContext";
import "./Contact.scss";
import ContactInline from "./ContactInline/ContactInline";
import ContactInModal from "./ContactInModal/ContactInModal";

function ContactHead({
  selectsLength,
  onContactRequest,
  isSelected,
  onAllSelectChange,
  deleteSelected,
}) {
  const [content, setContent] = useState(null);
  const { dispatch } = useContext(ModalContext);
  const { settings } = useContext(SettingsContext);
  function onSubmit(data) {
    if (Object.values(data).every((f) => f)) {
      onContactRequest(data, () => {
        dispatch({ isOpen: false });
        setContent(null);
      });
    }
  }

  function createNewContact() {
    if (settings.addInline) {
      setContent(
        <ContactInline
          onSave={onSubmit}
          contact={{}}
          onCancel={() => setContent(null)}
        />
      );
    } else {
      dispatch({
        isOpen: true,
        content: (
          <ContactInModal
            contact={{}}
            onSubmit={onSubmit}
            label="Create new contact"
          />
        ),
        contentLabel: "Hello",
      });
    }
  }

  return (
    <>
      <div className="contact-item-head">
        {!settings.cardView && (
          <input
            checked={isSelected}
            onChange={(e) => onAllSelectChange(e.target.checked)}
            type="checkbox"
            className="contact-item-checkbox"
          />
        )}
        {!settings.cardView && (
          <>
            <div className="contact-item-name">
              <span className="contact-item-name-text">Name</span>
            </div>
            <span className="contact-item-email">Email</span>
            <span className="contact-item-phone">Phone</span>
            <div className="contact-item-tags">Tags</div>
          </>
        )}
        <div className="contact-item-methods">
          {settings.cardView && (
            <input
              checked={isSelected}
              onChange={(e) => onAllSelectChange(e.target.checked)}
              type="checkbox"
              className="contact-item-methods-item"
            />
          )}
          <IoPersonAddOutline
            onClick={createNewContact}
            className="contact-item-methods-item"
          />
          <IoTrashOutline
            color={selectsLength ? "red" : "white"}
            onClick={deleteSelected}
            className="contact-item-methods-item"
          />
        </div>
      </div>
      {content}
    </>
  );
}

export default ContactHead;
