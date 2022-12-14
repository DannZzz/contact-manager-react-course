import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { DEFAULT_AVATAR } from "../../config";
import { ModalContext } from "../../Context/ModalContext";
import "./ContactInModal.scss";

/**
 * /**
 * @param {{
 * contact?: (typeof ContactLocalList)[number],
 * onSubmit?: any,
 * label?: string,
 * }} param0
 * @returns
 */
const ContactInModal = ({ contact, onSubmit, label }) => {
  const { dispatch } = useContext(ModalContext);

  const [copyContact, setCopyContact] = useState(contact);

  function submit(e) {
    e?.preventDefault();

    onSubmit(copyContact, () => dispatch({ isOpen: false }));
  }

  function handleChange(e) {
    let val = e.target.value;
    let name = e.target.name;
    if (e.target.name === "avatar")
      val = e.target?.files?.[0] || DEFAULT_AVATAR;

    if (e.target.name.startsWith("phone")) {
      const index = +name.slice(5);
      name = "phone";
      const phones = [...(copyContact?.phone || [])];
      phones[index] = e.target.value;
      val = phones;
    }

    const upt = { ...copyContact };
    upt[name] = val;
    setCopyContact(upt);
  }

  return (
    <div className="contact-in-modal-container">
      <h2>{label || ""}</h2>
      <form onSubmit={submit} className="contact-in-modal-form">
        <div className="input-field">
          <span>First Name</span>{" "}
          <input
            placeholder="First Name"
            value={copyContact.firstName}
            onChange={handleChange}
            type="text"
            name="firstName"
            required
          />
        </div>
        <div className="input-field">
          <span>Last Name</span>{" "}
          <input
            placeholder="Last Name"
            value={copyContact.lastName}
            onChange={handleChange}
            type="text"
            name="lastName"
            required
          />
        </div>
        <div className="input-field">
          <span>Email</span>{" "}
          <input
            placeholder="Email"
            value={copyContact.email}
            onChange={handleChange}
            name="email"
            type="email"
            required
          />
        </div>
        <div className="input-field">
          <span>Phone</span>{" "}
          {((copyContact.phone || [])?.length <= 3
            ? [...(copyContact.phone || []), ""]
            : copyContact.phone || []
          )?.map((phone, i) => (
            <input
              key={i}
              placeholder={"Phone " + (i + 1)}
              name={"phone" + i}
              value={phone || ""}
              onChange={handleChange}
              type="tel"
            />
          ))}
        </div>
        <div className="input-field">
          <span>Profession</span>{" "}
          <input
            placeholder="Profession"
            value={copyContact.profession}
            onChange={handleChange}
            type="text"
            name="profession"
            required
          />
        </div>
        <div className="input-field">
          <span>Avatar (Optional)</span>{" "}
          <label htmlFor="avatar-input">
            <img
              className="input-avatar"
              src={
                copyContact.avatar instanceof File
                  ? URL.createObjectURL(copyContact.avatar)
                  : copyContact.avatar
              }
              alt=""
            />
          </label>
          <input
            name="avatar"
            style={{ display: "none" }}
            id="avatar-input"
            type="file"
            accept="image/*"
            required
            onChange={handleChange}
          />
        </div>

        <div className="contact-in-modal-buttons">
          <button
            className="contact-in-modal-form-cancel"
            onClick={() => {
              dispatch({ isOpen: false });
            }}
          >
            Cancel
          </button>
          <button className="contact-in-modal-form-submit" onClick={submit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInModal;
