import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router-dom";

import CanvasPage from "./pages/CanvasPage";
import MainPage from "./pages/MainPage";
import { ConfirmationModalContextProvider } from "./store/ConfirmationModalContext";

const router = createBrowserRouter(
  createRoutesFromChildren(
    <>
      <Route path="/" element={<MainPage />} />
      <Route path="/:id" element={<CanvasPage />} />
    </>,
  ),
);

function App() {
  return (
    <ConfirmationModalContextProvider>
      <RouterProvider router={router} />
    </ConfirmationModalContextProvider>
  );
}

export default App;
