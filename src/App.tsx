import Canvas from "./components/Canvas";
import ToolButton from "./components/ToolButton";
import { FaRegHandPaper, FaPencilAlt } from "react-icons/fa";
import { PiCursor, PiEraser, PiRectangle } from "react-icons/pi";
import { IoTextOutline } from "react-icons/io5";
import { TfiLayoutLineSolid } from "react-icons/tfi";

import { canvasContext } from "./utils/CanvasContext";
import { hand } from "./utils/tools/Hand";
import { pencil } from "./utils/tools/Pencil";
import { lineDrawer } from "./utils/tools/LineDrawer";
import { eraser } from "./utils/tools/Eraser";
import { useState } from "react";
import Tool from "./utils/Tool";
import { rectangleDrawer } from "./utils/tools/RectangleDrawer";

const menu = [
  {
    icon: <FaRegHandPaper />,
    tool: hand,
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
      <Canvas />
      <div className="toolbar top">
        {menu.map(({ icon, tool }, index) => (
          <ToolButton
            key={index}
            icon={icon}
            isActive={activeTool === tool}
            onClick={onToolButtonClick(tool)}
          />
        ))}

        {/* <ToolButton icon={<FaRegHandPaper />} isActive={false} onClick={() => canvasContext.setActiveTool(hand)}/>
        <ToolButton icon={<PiCursor />} isActive={false} />
        <ToolButton icon={<FaPencilAlt />} isActive={false} onClick={() => canvasContext.setActiveTool(pencil)}/>
        <ToolButton icon={<PiEraser />} isActive={false} />
        <ToolButton icon={<IoTextOutline />} isActive={false} /> */}
      </div>
    </>
  );
}

export default App;
