import Segment from "../../types/Segment";

function segmentsIntersect(seg1: Segment, seg2: Segment) {
  const { x1: x1, y1: y1, x2: x2, y2: y2 } = seg1;
  const { x1: x3, y1: y3, x2: x4, y2: y4 } = seg2;

  const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (det === 0) return false;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

export default segmentsIntersect;
