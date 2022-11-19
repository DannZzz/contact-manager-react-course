import React from "react";
import { useContext } from "react";
import { ErrorContext } from "../Context/ErrorContext";
import "./Error.scss";

const Error = () => {
  const { error } = useContext(ErrorContext);
  if (!error) return <></>;
  console.log(error);
  return <div className="alert-error">{error}</div>;
};

export default Error;
