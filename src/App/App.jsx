import { lazy, Suspense } from "react";
import Header from "../Header/Header";
import _Modal from "react-modal";
import Modal from "../Modal/Modal";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MergeContext from "../Context/MergeContext";
import Error from "../Error/Error";

const Home = lazy(() => import("../pages/Home/Home"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Contact = lazy(() => import("../pages/Contact/Contact"));

/**
 *
 * @returns {Contact}
 */
function App() {
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
                <Home />
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
          <Route
            path="/contact/:id"
            element={
              <Suspense fallback={<></>}>
                <Contact />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </MergeContext>
  );
}

export default App;
