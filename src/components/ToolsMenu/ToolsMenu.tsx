import { observer } from "mobx-react-lite";
import { AiOutlinePicture } from "react-icons/ai";
import { FaPencilAlt,FaRegHandPaper } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import { IoTextOutline } from "react-icons/io5";
import { PiCircle,PiCursor, PiEraser, PiRectangle } from "react-icons/pi";
import { TfiLayoutLineSolid } from "react-icons/tfi";

import useCanvasContext from "@/hooks/useCanvasContext";
import Tool from "@/types/Tool";
import CanvasContext from "@/utils/CanvasContext";
import ArrowDrawer from "@/utils/tools/ArrowDrawer";
import CircleDrawer from "@/utils/tools/CircleDrawer";
import Eraser from "@/utils/tools/Eraser";
import Hand from "@/utils/tools/Hand";
import ImageTool from "@/utils/tools/ImageTool";
import LineDrawer from "@/utils/tools/LineDrawer";
import Pencil from "@/utils/tools/Pencil";
import RectangleDrawer from "@/utils/tools/RectangleDrawer";
import Select from "@/utils/tools/Select";
import TextTool from "@/utils/tools/TextTool";

import ToolButton from "../ToolButton/ToolButton";

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
    icon: <IoMdArrowRoundForward />,
    tool: ArrowDrawer,
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
    icon: <IoTextOutline />,
    tool: TextTool,
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
