import React, { useState } from "react";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { DEFAULT_AVATAR } from "../../config";

/**
 * /**
 * @param {{
 * contact?: (typeof ContactLocalList)[number],
 * onSave: any,
 * onCancel: any,
 * }} param0
 * @returns
 */
const ContactInline = ({ contact, onSave, onCancel }) => {
  const [copyContact, setCopyContact] = useState(contact);

  function onSubmit() {
    onSave(copyContact);
  }

  function handleChange(e) {
    let val = e.target.value;
    if (e.target.name === "avatar")
      val = e.target?.files?.[0] || DEFAULT_AVATAR;

    const upt = { ...copyContact };
    upt[e.target.name] = val;
    setCopyContact(upt);
  }

  return (
    <div className="contact-item">
      <input
        type="checkbox"
        disabled={true}
        className="contact-item-checkbox"
      />
      <div className="contact-item-name">
        <input
          name="avatar"
          onChange={handleChange}
          id="avatar-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
        <label htmlFor="avatar-input">
          <img
            className="contact-item-name-avatar edit-mode"
            src={
              (copyContact.avatar instanceof File
                ? URL.createObjectURL(copyContact.avatar)
                : copyContact.avatar) || DEFAULT_AVATAR
            }
            alt=""
          />
        </label>
        <input
          placeholder="First Name"
          value={copyContact.firstName || ""}
          name="firstName"
          onChange={handleChange}
          type="text"
          className="contact-item-name-text"
        />
        <input
          placeholder="Last Name"
          name="lastName"
          value={copyContact.lastName || ""}
          onChange={handleChange}
          type="text"
          className="contact-item-name-text"
        />
      </div>
      <input
        placeholder="Email"
        name="email"
        value={copyContact.email || ""}
        onChange={handleChange}
        type="email"
        className="contact-item-email"
      />
      <input
        placeholder="Phone"
        name="phone"
        value={copyContact.phone || ""}
        onChange={handleChange}
        type="tel"
        className="contact-item-phone"
      />
      <input
        placeholder="Profession"
        name="profession"
        value={copyContact.profession || ""}
        onChange={handleChange}
        type="text"
        className="contact-item-tags"
      />
      <div className="contact-item-methods">
        <IoSaveOutline
          className="contact-item-methods-item"
          onClick={onSubmit}
        />
        <IoClose
          className="contact-item-methods-item"
          color="red"
          onClick={onCancel}
        />
      </div>
    </div>
  );
};

export default ContactInline;
