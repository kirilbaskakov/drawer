import Canvas from "./components/Canvas";
import ToolButton from "./components/ToolButton";
import { FaRegHandPaper, FaPencilAlt } from "react-icons/fa";
import { PiCursor, PiEraser, PiRectangle, PiCircle } from "react-icons/pi";
import { IoTextOutline } from "react-icons/io5";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { canvasContext } from "./utils/CanvasContext";
import { hand } from "./utils/tools/Hand";
import { pencil } from "./utils/tools/Pencil";
import { lineDrawer } from "./utils/tools/LineDrawer";
import { eraser } from "./utils/tools/Eraser";
import { useState } from "react";
import Tool from "./types/Tool";
import { rectangleDrawer } from "./utils/tools/RectangleDrawer";
import ToolSettingsPanel from "./components/ToolSettingsPanel";
import Zoom from "./components/Zoom";
import { select } from "./utils/tools/Select";
import { circleDrawer } from "./utils/tools/CircleDrawer";
import UndoRedo from "./components/UndoRedo";
import Menu from "./components/Menu";

const menu = [
  {
    icon: <FaRegHandPaper />,
    tool: hand,
  },
  {
    icon: <PiCursor />,
    tool: select,
  },
  {
    icon: <FaPencilAlt />,
    tool: pencil,
  },
  {
    icon: <TfiLayoutLineSolid />,
    tool: lineDrawer,
  },
  {
    icon: <PiRectangle />,
    tool: rectangleDrawer,
  },
  {
    icon: <PiCircle />,
    tool: circleDrawer,
  },
  {
    icon: <PiEraser />,
    tool: eraser,
  },
];

function App() {
  const [activeTool, setActiveTool] = useState<null | Tool>(null);

  const onToolButtonClick = (tool: Tool) => () => {
    setActiveTool(tool);
    canvasContext.setActiveTool(tool);
  };

  return (
    <>
      <Menu />
      <Canvas />
      <div className="toolbar toolbar-top-center row">
        {menu.map(({ icon, tool }, index) => (
          <ToolButton
            key={index}
            icon={icon}
            isActive={activeTool === tool}
            onClick={onToolButtonClick(tool)}
          />
        ))}
      </div>
      <ToolSettingsPanel />
      <Zoom />
      <UndoRedo />
    </>
  );
}

export default App;
