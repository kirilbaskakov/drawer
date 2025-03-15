import Rect from "../../types/Rect";
import Segment from "../../types/Segment";
import isPointInRect from "./isPointInRect";

function segmentInRect(seg: Segment, rect: Rect) {
  const startPoint = { x: seg.x1, y: seg.y1 };
  const endPoint = { x: seg.x2, y: seg.y2 };

  return isPointInRect(startPoint, rect) && isPointInRect(endPoint, rect);
}

export default segmentInRect;
