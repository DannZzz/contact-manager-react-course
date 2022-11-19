import React from "react";
import { ErrorContextProvider } from "./ErrorContext";
import { ModalContextProvider } from "./ModalContext";
import { SettingsContextProvider } from "./SettingsContext";

const MergeContext = ({ children }) => {
  return (
    <SettingsContextProvider>
      <ErrorContextProvider>
        <ModalContextProvider>{children}</ModalContextProvider>
      </ErrorContextProvider>
    </SettingsContextProvider>
  );
};

export default MergeContext;
