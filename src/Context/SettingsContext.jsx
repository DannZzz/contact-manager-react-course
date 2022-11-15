import { useState } from "react";
import { createContext } from "react";
import { CARD_VIEW, INLINE_ADD, INLINE_EDIT } from "../config";

export const SettingsInit = {
  editInline: INLINE_EDIT,
  addInline: INLINE_ADD,
  cardView: CARD_VIEW,
  /**@type {"name" | "email" | "phone" | "profession"} */
  search: { query: "", type: "name" },
};

/**
 * @type {{settings: typeof SettingsInit, dispatch(type: keyof typeof SettingsInit, bool: boolean | typeof SettingsInit['search']): any}}
 */
const _init = { modeInline: SettingsInit, dispatch(type, bool) {} };
export const SettingsContext = createContext(_init);

export const SettingsContextProvider = ({ children }) => {
  const [settings, setSettings] = useState(SettingsInit);

  function dispatch(type, bool) {
    setSettings({ ...settings, [type]: bool });
  }

  return (
    <SettingsContext.Provider value={{ settings: settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};
