import {
  SELECTED_STYLES,
  SELECTION_STYLES,
} from "../../constants/drawingDefaults";
import Rect from "../../types/Rect";
import CanvasContext, { canvasContext } from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../../types/Tool";
import isPointInRect from "../geometry/isPointInRect";
import { CanvasStyles } from "../../types/CanvasStyles";

class Select implements Tool {
  cursor: string = "default";

  private canvasContext: CanvasContext;
  private position: [number, number] | null = null;
  private selectedRects: Figure | null = null;
  private selectionRect: Figure | null = null;
  private selectedFigures: Figure[] = [];
  private isSelecting = false;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
  }

  handleMouseUp() {
    this.position = null;
    this.isSelecting = false;
    if (this.selectionRect) {
      this.canvasContext.deleteFigure(this.selectionRect);
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.selectedRects || !this.canvasContext.canvas) {
      return;
    }
    if (!this.isSelecting) {
      if (
        isPointInRect(
          { x: e.pageX, y: e.pageY },
          this.selectedRects.getClientBoundingRect(),
        )
      ) {
        this.canvasContext.canvas.style.cursor = "move";
      } else {
        this.canvasContext.canvas.style.cursor = "default";
      }
      if (this.position) {
        const dx =
            (e.pageX - this.position[0]) / this.canvasContext.scaleFactor,
          dy = (e.pageY - this.position[1]) / this.canvasContext.scaleFactor;
        this.selectedFigures.forEach((figure) => figure.translate(dx, dy));
        this.position = [e.pageX, e.pageY];
        this.selectedRects.translate(dx, dy);
        this.canvasContext.repaint();
      }
      return;
    }
    if (!this.selectionRect || !this.position) {
      return;
    }
    this.selectionRect.clear();
    const rect: Rect = {
      x1: this.position[0],
      y1: this.position[1],
      x2: e.pageX,
      y2: e.pageY,
    };
    this.selectionRect.drawRect(rect);
    this.selectedFigures = this.canvasContext
      .selectFiguresInRect(rect)
      .filter(
        (figure) =>
          figure.id != this.selectionRect?.id &&
          figure.id != this.selectedRects?.id,
      );
    this.drawSelectedRects();
    this.canvasContext.repaint();
  }

  handleMouseDown(e: MouseEvent) {
    this.position = [e.pageX, e.pageY];
    if (
      this.selectedRects &&
      isPointInRect(
        { x: e.pageX, y: e.pageY },
        this.selectedRects.getClientBoundingRect(),
      )
    ) {
      this.isSelecting = false;
      return;
    }
    this.isSelecting = true;
    this.selectedFigures = [];
    if (this.selectedRects) {
      this.canvasContext.deleteFigure(this.selectedRects);
    }
    this.selectionRect = new Figure();
    this.selectedRects = new Figure();
    this.selectionRect.setStyles(SELECTION_STYLES);
    this.selectedRects.setStyles(SELECTED_STYLES);
    this.canvasContext.addFigure(this.selectionRect);
    this.canvasContext.addFigure(this.selectedRects);
  }

  reset() {
    if (this.selectedRects) {
      this.canvasContext.deleteFigure(this.selectedRects);
    }
  }

  updateStyles(styles: Partial<CanvasStyles>) {
    if (this.selectedFigures) {
      this.selectedFigures.forEach((figure) => figure.setStyles(styles));
      this.canvasContext.repaint();
    }
  }

  private drawSelectedRects() {
    if (!this.selectedRects) {
      return;
    }
    this.selectedRects.clear();
    this.selectedFigures.forEach((figure) => {
      const rect = figure.getClientBoundingRect();
      rect.x1 -= 5;
      rect.y1 -= 5;
      rect.x2 += 5;
      rect.y2 += 5;
      this.selectedRects?.drawRect(rect);
    });
    this.selectedRects?.drawRect(this.selectedRects.getClientBoundingRect());
  }
}

export const select = new Select(canvasContext);

export default Select;
