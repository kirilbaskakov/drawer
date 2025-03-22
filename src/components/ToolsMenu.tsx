import CanvasContext from "../utils/CanvasContext";
import Tool from "../types/Tool";
import ToolButton from "./ToolButton";
import { FaRegHandPaper, FaPencilAlt } from "react-icons/fa";
import { PiCursor, PiEraser, PiRectangle, PiCircle } from "react-icons/pi";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { AiOutlinePicture } from "react-icons/ai";
import Hand from "../utils/tools/Hand";
import Select from "../utils/tools/Select";
import Pencil from "../utils/tools/Pencil";
import LineDrawer from "../utils/tools/LineDrawer";
import RectangleDrawer from "../utils/tools/RectangleDrawer";
import CircleDrawer from "../utils/tools/CircleDrawer";
import Eraser from "../utils/tools/Eraser";
import ImageTool from "../utils/tools/ImageTool";
import useCanvasContext from "../hooks/useCanvasContext";
import { observer } from "mobx-react-lite";

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
    icon: <AiOutlinePicture />,
    tool: ImageTool,
  },
  {
    icon: <PiEraser />,
    tool: Eraser,
  },
];

const ToolsMenu = observer(() => {
  const { canvasContext } = useCanvasContext();

  const onToolButtonClick =
    (tool: new (canvasContext: CanvasContext) => Tool) => () => {
      const newTool = new tool(canvasContext);
      canvasContext.setActiveTool(newTool);
    };

  return (
    <div className="toolbar toolbar-top-center row">
      {menu.map(({ icon, tool }, index) => (
        <ToolButton
          key={index}
          icon={icon}
          isActive={canvasContext.activeTool instanceof tool}
          onClick={onToolButtonClick(tool)}
        />
      ))}
    </div>
  );
});

export default ToolsMenu;
