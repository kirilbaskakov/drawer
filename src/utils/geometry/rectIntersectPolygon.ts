import Rect from "../../types/Rect";
import isPointInPolygon from "./isPointInPolygon";
import segmentIntersectRect from "./segmentIntersectRect";

const rectIntersectPolygon = (rect: Rect, polygon: Array<[number, number]>) => {
  for (let i = 1; i < polygon.length; i++) {
    if (
      segmentIntersectRect(
        {
          x1: polygon[i - 1][0],
          y1: polygon[i - 1][1],
          x2: polygon[i][0],
          y2: polygon[i][1],
        },
        rect,
      )
    ) {
      return true;
    }
  }
  return (
    isPointInPolygon([rect.x1, rect.y1], polygon) ||
    isPointInPolygon([rect.x1, rect.y2], polygon) ||
    isPointInPolygon([rect.x2, rect.y1], polygon) ||
    isPointInPolygon([rect.x2, rect.y2], polygon)
  );
};

export default rectIntersectPolygon;
