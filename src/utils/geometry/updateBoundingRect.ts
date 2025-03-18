import { DEFAULT_BOUDING_RECT } from "../../constants/drawingDefaults";
import Rect from "../../types/Rect";

const updateBoundingRect = (boundingRect: Rect, x: number, y: number) => {
  if (boundingRect.x1 == DEFAULT_BOUDING_RECT.x1) {
    boundingRect.x1 = x;
    boundingRect.y1 = y;
    boundingRect.x2 = x;
    boundingRect.y2 = y;
    return;
  }
  boundingRect.x1 = Math.min(boundingRect.x1, x);
  boundingRect.x2 = Math.max(boundingRect.x2, x);
  boundingRect.y1 = Math.min(boundingRect.y1, y);
  boundingRect.y2 = Math.max(boundingRect.y2, y);
};

export default updateBoundingRect;
