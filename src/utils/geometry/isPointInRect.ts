import Point from "../../types/Point";
import Rect from "../../types/Rect";

function isPointInRect(point: Point, { x1, x2, y1, y2 }: Rect) {
  return (
    point.x >= Math.min(x1, x2) &&
    point.x <= Math.max(x1, x2) &&
    point.y >= Math.min(y1, y2) &&
    point.y <= Math.max(y1, y2)
  );
}

export default isPointInRect;
