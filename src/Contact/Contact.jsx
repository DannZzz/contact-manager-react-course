import React, { useState } from "react";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import "./Contact.scss";
import { DEFAULT_AVATAR } from "../config";
import { useContext } from "react";
import { ModalContext } from "../Context/ModalContext";
import ContactInModal from "./ContactInModal/ContactInModal";
import ContactInline from "./ContactInline/ContactInline";
import { SettingsContext } from "../Context/SettingsContext";
import classNames from "classnames";

/**
 * @param {{
 * contact: (typeof ContactLocalList)[number],
 * onRemove: (id: string) => any,
 * onSelectChange: (id: string, checked: boolean) => any,,
 * onValuesSave: (id: string, contact: Partial<(typeof ContactLocalList)[number]>)
 * }} props
 */
function Contact({
  isSelected,
  contact,
  onRemove,
  onSelectChange,
  onValuesSave,
  isEdit,
  reff,
}) {
  const [confirm, setConfirm] = useState(false);
  const { dispatch } = useContext(ModalContext);
  const [inlineEdit, setInlineEdit] = useState(false);
  const { settings } = useContext(SettingsContext);

  function handleConfirm(id, value) {
    setConfirm(false);
    if (value) onRemove(id);
  }

  function onSave(data, fn) {
    onValuesSave(
      contact.id,
      { ...data, phone: data.phone.filter((x) => x) },
      fn
        ? fn
        : () => {
            setInlineEdit(false);
            isEdit[1](false);
          }
    );
  }

  function onEditCancel() {
    isEdit[1](false);
    setInlineEdit(false);
  }

  function onEditStart() {
    if (settings.editInline) {
      isEdit[1](true);
      setInlineEdit(true);
    } else {
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
  }

  if (inlineEdit)
    return (
      <ContactInline
        contact={contact}
        onSave={onSave}
        onCancel={onEditCancel}
      />
    );

  return (
    <div
      ref={reff.innerRef}
      {...reff.draggableProps}
      {...reff.dragHandleProps}
      className={classNames("contact-item", { "background-color": isSelected })}
    >
      <input
        onChange={(e) => onSelectChange(contact.id, e.target.checked)}
        type="checkbox"
        checked={isSelected}
        className="contact-item-checkbox"
      />
      <div className="contact-item-name">
        <img
          className="contact-item-name-avatar"
          src={contact.avatar || DEFAULT_AVATAR}
          alt=""
        />

        <span>
          {(contact.firstName || "") + " " + (contact.lastName || "")}
        </span>
      </div>

      <span className="contact-item-email">{contact.email}</span>

      <div className="contact-item-phone">
        {contact.phone?.map((phone, i) => (
          <span key={i}>{phone}</span>
        ))}
      </div>

      <div className="contact-item-tags">{contact.profession}</div>
      <div className="contact-item-methods">
        {!isEdit[0] && (
          <IoCreateOutline
            className="contact-item-methods-item"
            onClick={onEditStart}
          />
        )}
        {!confirm ? (
          <IoTrashOutline
            className="contact-item-methods-item"
            color="red"
            onClick={() => setConfirm(true)}
          />
        ) : (
          <div className="contact-item-methods-item-confirm">
            Are you sure?
            <div className="contact-item-methods-item-confirm-buttons">
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

export default Contact;
