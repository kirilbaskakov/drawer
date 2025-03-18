import { useState } from "react";
import { canvasContext } from "../utils/CanvasContext";
import Tool from "../types/Tool";
import ToolButton from "./ToolButton";
import { FaRegHandPaper, FaPencilAlt } from "react-icons/fa";
import { PiCursor, PiEraser, PiRectangle, PiCircle } from "react-icons/pi";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { hand } from "../utils/tools/Hand";
import { select } from "../utils/tools/Select";
import { pencil } from "../utils/tools/Pencil";
import { lineDrawer } from "../utils/tools/LineDrawer";
import { rectangleDrawer } from "../utils/tools/RectangleDrawer";
import { circleDrawer } from "../utils/tools/CircleDrawer";
import { eraser } from "../utils/tools/Eraser";

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

const ToolsMenu = () => {
  const [activeTool, setActiveTool] = useState<null | Tool>(null);

  const onToolButtonClick = (tool: Tool) => () => {
    setActiveTool(tool);
    canvasContext.setActiveTool(tool);
  };

  return (
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
  );
};

export default ToolsMenu;
