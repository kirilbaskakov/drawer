import Point from "../../types/Point";
import Rect from "../../types/Rect";
import Segment from "../../types/Segment";

function isPointInRect(point: Point, rect: Rect) {
  return (
    point.x >= rect.x1 &&
    point.x <= rect.x2 &&
    point.y >= rect.y1 &&
    point.y <= rect.y2
  );
}

function segmentInRect(seg: Segment, rect: Rect) {
  const startPoint = { x: seg.x1, y: seg.y1 };
  const endPoint = { x: seg.x2, y: seg.y2 };

  return isPointInRect(startPoint, rect) && isPointInRect(endPoint, rect);
}

export default segmentInRect;
