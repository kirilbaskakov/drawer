import { useState } from "react";
import CanvasContext from "../utils/CanvasContext";
import Tool from "../types/Tool";
import ToolButton from "./ToolButton";
import { FaRegHandPaper, FaPencilAlt } from "react-icons/fa";
import { PiCursor, PiEraser, PiRectangle, PiCircle } from "react-icons/pi";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import Hand from "../utils/tools/Hand";
import Select from "../utils/tools/Select";
import Pencil from "../utils/tools/Pencil";
import LineDrawer from "../utils/tools/LineDrawer";
import RectangleDrawer from "../utils/tools/RectangleDrawer";
import CircleDrawer from "../utils/tools/CircleDrawer";
import Eraser from "../utils/tools/Eraser";
import useCanvasContext from "../hooks/useCanvasContext";

const menu = [
  {
    icon: <FaRegHandPaper />,
    tool: Hand,
  },
  {
    icon: <PiCursor />,
    tool: Select,
  },
  {
    icon: <FaPencilAlt />,
    tool: Pencil,
  },
  {
    icon: <TfiLayoutLineSolid />,
    tool: LineDrawer,
  },
  {
    icon: <PiRectangle />,
    tool: RectangleDrawer,
  },
  {
    icon: <PiCircle />,
    tool: CircleDrawer,
  },
  {
    icon: <PiEraser />,
    tool: Eraser,
  },
];

const ToolsMenu = () => {
  const { canvasContext } = useCanvasContext();
  const [activeTool, setActiveTool] = useState<null | Tool>(null);

  const onToolButtonClick =
    (tool: new (canvasContext: CanvasContext) => Tool) => () => {
      const newTool = new tool(canvasContext);
      setActiveTool(newTool);
      canvasContext.setActiveTool(newTool);
    };

  return (
    <div className="toolbar toolbar-top-center row">
      {menu.map(({ icon, tool }, index) => (
        <ToolButton
          key={index}
          icon={icon}
          isActive={activeTool instanceof tool}
          onClick={onToolButtonClick(tool)}
        />
      ))}
    </div>
  );
};

export default ToolsMenu;
