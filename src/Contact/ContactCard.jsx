import classNames from "classnames";
import React, { useContext, useState } from "react";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { DEFAULT_AVATAR } from "../config";
import { ModalContext } from "../Context/ModalContext";
import { SettingsContext } from "../Context/SettingsContext";
import ContactInline from "./ContactInline/ContactInline";
import ContactInModal from "./ContactInModal/ContactInModal";

/**
 * @param {{
 * contact: (typeof ContactLocalList)[number],
 * onRemove: (id: string) => any,
 * onSelectChange: (id: string, checked: boolean) => any,
 * onValuesSave: (id: string, contact: Partial<(typeof ContactLocalList)[number]>),
 * isSelected: boolean
 * }} props
 */
function ContactCard({
  contact,
  onRemove,
  onSelectChange,
  onValuesSave,
  isSelected,
}) {
  const [confirm, setConfirm] = useState(false);
  const { dispatch } = useContext(ModalContext);
  const { settings } = useContext(SettingsContext);

  function handleConfirm(id, value) {
    setConfirm(false);
    if (value) onRemove(id);
  }

  function onSave(data, fn) {
    onValuesSave(contact.id, data, fn);
  }

  function onEditStart() {
    dispatch({
      isOpen: true,
      content: (
        <ContactInModal
          contact={contact}
          onSubmit={onSave}
          label="Edit Contact"
        />
      ),
    });
  }

  return (
    <div
      className={classNames("contact-item-card", {
        "background-color": isSelected,
      })}
    >
      <input
        onChange={(e) => onSelectChange(contact.id, e.target.checked)}
        type="checkbox"
        checked={isSelected}
        className="contact-item-card-checkbox"
      />
      <img
        className="contact-item-card-avatar"
        src={contact.avatar || DEFAULT_AVATAR}
        alt=""
      />
      <div className="contact-item-card-texts">
        <strong>{contact.firstName + " " + contact.lastName}</strong>
        <span>{contact.email}</span>
        {contact.phone.map((phone, i) => (
          <span key={i}>{phone}</span>
        ))}
        <span>{contact.profession}</span>
      </div>

      <div className="contact-item-card-methods">
        <IoCreateOutline
          className="contact-item-card-methods-item"
          onClick={onEditStart}
        />
        {!confirm ? (
          <IoTrashOutline
            className="contact-item-card-methods-item"
            color="red"
            onClick={() => setConfirm(true)}
          />
        ) : (
          <div className="contact-item-card-methods-item-confirm">
            Are you sure?
            <div className="contact-item-card-methods-item-confirm-buttons">
              <button
                onClick={() => handleConfirm(contact.id, true)}
                className="yes"
              >
                Yes
              </button>
              <button
                onClick={() => handleConfirm(contact.id, false)}
                className="no"
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactCard;
