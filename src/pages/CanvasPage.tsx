import Canvas from "@/components/Canvas/Canvas";
import Menu from "@/components/Menu/Menu";
import ToolSettingsPanel from "@/components/ToolSettingsPanel/ToolSettingsPanel";
import ToolsMenu from "@/components/ToolsMenu/ToolsMenu";
import UndoRedo from "@/components/UndoRedo/UndoRedo";
import Zoom from "@/components/Zoom/Zoom";
import CanvasStoreProvider from "@/store/CanvasStoreContext";

const CanvasPage = () => {
  return (
    <CanvasStoreProvider>
      <div className="canvas-page">
        <Menu />
        <Canvas />
        <ToolsMenu />
        <ToolSettingsPanel />
        <Zoom />
        <UndoRedo />
      </div>
    </CanvasStoreProvider>
  );
};

export default CanvasPage;
