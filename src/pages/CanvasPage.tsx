import Canvas from "../components/Canvas";
import ToolSettingsPanel from "../components/ToolSettingsPanel";
import Zoom from "../components/Zoom";
import UndoRedo from "../components/UndoRedo";
import Menu from "../components/Menu";
import ToolsMenu from "../components/ToolsMenu";
import CanvasStoreProvider from "../store/CanvasStoreContext";

const CanvasPage = () => {
  return (
    <CanvasStoreProvider>
      <Menu />
      <Canvas />
      <ToolsMenu />
      <ToolSettingsPanel />
      <Zoom />
      <UndoRedo />
    </CanvasStoreProvider>
  );
};

export default CanvasPage;
