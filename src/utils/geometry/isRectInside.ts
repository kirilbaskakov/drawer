import Rect from "../../types/Rect";
import isPointInRect from "./isPointInRect";

function isRectInside(rectOut: Rect, rectIn: Rect): boolean {
  const cornersRectIn = [
    { x: rectIn.x1, y: rectIn.y1 },
    { x: rectIn.x1, y: rectIn.y2 },
    { x: rectIn.x2, y: rectIn.y1 },
    { x: rectIn.x2, y: rectIn.y2 },
  ];

  return cornersRectIn.every((corner) => isPointInRect(corner, rectOut));
}

export default isRectInside;
