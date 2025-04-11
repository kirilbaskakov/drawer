import Rect from "../../types/Rect";
import Segment from "../../types/Segment";
import segmentInRect from "./segmentInRect";
import segmentsIntersect from "./segmentsIntersect";

function segmentIntersectRect(seg: Segment, rect: Rect) {
  const top = { x1: rect.x1, y1: rect.y1, x2: rect.x2, y2: rect.y1 };
  const right = { x1: rect.x2, y1: rect.y1, x2: rect.x2, y2: rect.y2 };
  const bottom = { x1: rect.x1, y1: rect.y2, x2: rect.x2, y2: rect.y2 };
  const left = { x1: rect.x1, y1: rect.y1, x2: rect.x1, y2: rect.y2 };

  return (
    segmentInRect(seg, rect) ||
    segmentsIntersect(seg, top) ||
    segmentsIntersect(seg, right) ||
    segmentsIntersect(seg, bottom) ||
    segmentsIntersect(seg, left)
  );
}

export default segmentIntersectRect;
