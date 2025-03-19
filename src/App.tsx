import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import CanvasPage from "./pages/CanvasPage";
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
