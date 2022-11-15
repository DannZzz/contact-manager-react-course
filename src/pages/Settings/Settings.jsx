import React, { useContext } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import "./Settings.scss";

const Settings = () => {
  const { dispatch, settings } = useContext(SettingsContext);

  function onRadioChange(e, type) {
    dispatch(type, Boolean(e.target.value));
  }
  return (
    <div className="settings-container">
      <div className="setting">
        <h3 className="setting-title">Inline Edit</h3>
        <div className="setting-inputs">
          <input
            type="radio"
            name="inline-mode-edit"
            checked={settings.editInline}
            value={" "}
            id="input-yes"
            onChange={(e) => onRadioChange(e, "editInline")}
          />
          <label htmlFor="input-yes">Yes</label>
          <input
            type="radio"
            name="inline-mode-edit"
            checked={!settings.editInline}
            value={""}
            id="input-no"
            onChange={(e) => onRadioChange(e, "editInline")}
          />
          <label htmlFor="input-no">No</label>
        </div>
      </div>

      <div className="setting">
        <h3 className="setting-title">Inline Add</h3>
        <div className="setting-inputs">
          <input
            type="radio"
            name="inline-mode-add"
            checked={settings.addInline}
            value={" "}
            id="input-yes"
            onChange={(e) => onRadioChange(e, "addInline")}
          />
          <label htmlFor="input-yes">Yes</label>
          <input
            type="radio"
            name="inline-mode-add"
            checked={!settings.addInline}
            value={""}
            id="input-no"
            onChange={(e) => onRadioChange(e, "addInline")}
          />
          <label htmlFor="input-no">No</label>
        </div>
      </div>

      <div className="setting">
        <h3 className="setting-title">View Type</h3>
        <div className="setting-inputs">
          <input
            type="radio"
            name="inline-mode-view"
            checked={settings.cardView}
            value={" "}
            id="input-yes"
            onChange={(e) => onRadioChange(e, "cardView")}
          />
          <label htmlFor="input-yes">Card</label>
          <input
            type="radio"
            name="inline-mode-view"
            checked={!settings.cardView}
            value={""}
            id="input-no"
            onChange={(e) => onRadioChange(e, "cardView")}
          />
          <label htmlFor="input-no">List</label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
