import { useState } from "react";
import { createContext } from "react";

export const ModalInit = {
  isOpen: false,
  onAfterOpen: () => {},
  contentLabel: "",
  content: null
};
/**
 * @type {{modal: typeof ModalInit, dispatch(modal: typeof ModalInit): any}}
 */
const _init = { modal: ModalInit, dispatch(modal) {} };
export const ModalContext = createContext(_init);

export const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = useState(ModalInit);

  function dispatch(_modal) {
    setModal({ ...modal, ..._modal });
  }

  return (
    <ModalContext.Provider value={{ modal, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};
