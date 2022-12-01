import React, { useState } from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import {
  IoHomeOutline,
  IoInformationCircle,
  IoSettingsOutline,
} from "react-icons/io5";
import { useContext } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import { useRef } from "react";

const Header = () => {
  const { dispatch, settings } = useContext(SettingsContext);
  const [searchType, setSearchType] = useState("name");
  const searchInputRef = useRef();
  function onSearchTypeChange(value) {
    setSearchType(value);
  }

  function onSearch(e) {
    dispatch("search", {
      query: searchInputRef.current.value,
      type: searchType,
    });
  }

  const activeClassName = "selected-link";

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-item app-name">
          <span>Contact Manager</span>
        </div>

        {settings.showSearch && (
          <div className="header-item">
            <div className="search-input">
              <div className="custom-select">
                <select
                  onChange={(e) => onSearchTypeChange(e.target.value)}
                  value={settings.searchType}
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="profession">Profession</option>
                </select>
              </div>
              <input
                onChange={onSearch}
                ref={searchInputRef}
                type="text"
                placeholder="Search.."
              />
            </div>
          </div>
        )}

        <div className="header-item">
          <NavLink
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
            to="/"
          >
            <IoHomeOutline /> Home
          </NavLink>
        </div>

        <div className="header-item">
          <NavLink
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
            to="/about"
          >
            <IoInformationCircle /> About
          </NavLink>
        </div>

        <div className="header-item">
          <NavLink
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
            to="/settings"
          >
            <IoSettingsOutline /> Settings
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
