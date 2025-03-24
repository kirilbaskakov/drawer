import Rect from "../../types/Rect";

const createPolygonFromRect = (rect: Rect): Array<[number, number]> => {
  return [
    [rect.x1, rect.y1],
    [rect.x2, rect.y1],
    [rect.x2, rect.y2],
    [rect.x1, rect.y2],
  ];
};

export default createPolygonFromRect;
