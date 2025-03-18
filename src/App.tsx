import Canvas from "./components/Canvas";

import ToolSettingsPanel from "./components/ToolSettingsPanel";
import Zoom from "./components/Zoom";
import UndoRedo from "./components/UndoRedo";
import Menu from "./components/Menu";
import { ConfirmationModalContextProvider } from "./store/ConfirmationModalContext";
import ToolsMenu from "./components/ToolsMenu";

function App() {
  return (
    <ConfirmationModalContextProvider>
      <Menu />
      <Canvas />
      <ToolsMenu />
      <ToolSettingsPanel />
      <Zoom />
      <UndoRedo />
    </ConfirmationModalContextProvider>
  );
}

export default App;
