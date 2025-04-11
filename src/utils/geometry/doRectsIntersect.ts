import Rect from "../../types/Rect";
import isPointInRect from "./isPointInRect";

function doRectsIntersect(rect1: Rect, rect2: Rect): boolean {
  const cornersRect2 = [
    { x: rect2.x1, y: rect2.y1 },
    { x: rect2.x1, y: rect2.y2 },
    { x: rect2.x2, y: rect2.y1 },
    { x: rect2.x2, y: rect2.y2 },
  ];

  for (const corner of cornersRect2) {
    if (isPointInRect(corner, rect1)) {
      return true;
    }
  }

  const cornersRect1 = [
    { x: rect1.x1, y: rect1.y1 },
    { x: rect1.x1, y: rect1.y2 },
    { x: rect1.x2, y: rect1.y1 },
    { x: rect1.x2, y: rect1.y2 },
  ];

  for (const corner of cornersRect1) {
    if (isPointInRect(corner, rect2)) {
      return true;
    }
  }

  return false;
}

export default doRectsIntersect;
