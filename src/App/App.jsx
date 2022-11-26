import { lazy, Suspense, useEffect, useState } from "react";
import Header from "../Header/Header";
import _Modal from "react-modal";
import Modal from "../Modal/Modal";
import "./App.scss";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import MergeContext from "../Context/MergeContext";
import Error from "../Error/Error";

const Home = lazy(() => import("../pages/Home/Home"));
const Settings = lazy(() => import("../pages/Settings/Settings"));

/**
 *
 * @returns {Contact}
 */
function App() {
  const [list, setList] = useState([]);
  const [selects, setSelects] = useState([]);
  const { request } = useFetch();
  useEffect(() => {
    request("/list/get").then((res) => {
      if (res.data) setList(res.data);
    });
  }, []);

  return (
    <MergeContext>
      <Error />
      <Modal />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            index
            path="/*"
            element={
              <Suspense fallback={<></>}>
                <Home
                  list={list}
                  selects={selects}
                  setList={setList}
                  setSelects={setSelects}
                />
              </Suspense>
            }
          />

          <Route
            path="/settings"
            element={
              <Suspense fallback={<></>}>
                <Settings />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </MergeContext>
  );
}

export default App;
