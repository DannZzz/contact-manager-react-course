import { useState } from "react";
import { createContext } from "react";

export const ErrorInit = {
  message: "",
  endsIn: null,
};

/**
 * @type {{error: typeof ErrorInit, dispatchError(message: string, endsIn: number): any}}
 */
const _init = { error: ErrorInit, dispatchError(message, endsIn) {} };
export const ErrorContext = createContext(_init);

export const ErrorContextProvider = ({ children }) => {
  const [error, setError] = useState(ErrorInit);
  let timeout;
  function dispatch(message, endsIn) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(function () {
      setError({ message: "", endsIn: null });
      clearTimeout(this);
      timeout = null;
    }, endsIn);
    setError({ message, endsIn });
  }

  return (
    <ErrorContext.Provider
      value={{ error: error.message, dispatchError: dispatch }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
