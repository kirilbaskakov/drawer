import Rect from "../../types/Rect";

const addPadding = (rect: Rect, px = 0, py = 0) => {
  const rectCopy = { ...rect };
  rectCopy.x1 = Math.min(rect.x1, rect.x2) - px;
  rectCopy.x2 = Math.max(rect.x1, rect.x2) + px;
  rectCopy.y1 = Math.min(rect.y1, rect.y2) - py;
  rectCopy.y2 = Math.max(rect.y1, rect.y2) + py;
  return rectCopy;
};

export default addPadding;
