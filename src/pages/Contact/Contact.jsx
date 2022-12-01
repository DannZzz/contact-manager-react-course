import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SettingsContext } from "../../Context/SettingsContext";
import useFetch from "../../hooks/useFetch";
import "./Contact.scss";

const Contact = () => {
  const { id } = useParams();
  const { dispatch } = useContext(SettingsContext);
  const [contact, setContact] = useState({});
  const { request } = useFetch();

  useEffect(() => {
    dispatch("showSearch", false);
    request("/contact/" + id).then((res) => {
      if (res.status === "OK") {
        setContact(res.data);
      }
    });

    return () => {
      dispatch("showSearch", true);
    };
  }, []);

  return (
    <div className="contact-page">
      <div className="contact">
        <img src={contact.avatar} alt="" />
        <h3>{`${contact.firstName} ${contact.lastName}`}</h3>
        <span>{contact.email}</span>
        <span>
          {contact.phone?.map((phone, index) => (
            <div key={index}>{phone}</div>
          ))}
        </span>
      </div>
    </div>
  );
};

export default Contact;
