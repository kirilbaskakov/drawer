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
import addPadding from "../geometry/addPadding";
import KEY_BINDINGS from "../../constants/hotkeys";
import { keyComboListener } from "../KeyComboListener";

class Select implements Tool {
  cursor: string = "default";
  definableStyles: Array<keyof CanvasStyles> = [];

  private canvasContext: CanvasContext;
  private position: [number, number] | null = null;
  private selectedRects: Figure | null = null;
  private selectionRect: Figure | null = null;
  private selectedFigures: Figure[] = [];
  private isSelecting = false;

  private currDx = 0;
  private currDy = 0;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
    keyComboListener.subscribe(KEY_BINDINGS.DELETE, () => {
      if (this.selectedFigures) {
        this.canvasContext.deleteFigures(this.selectedFigures);
        this.reset();
      }
    });
  }

  handleMouseUp() {
    this.position = null;
    this.isSelecting = false;
    if (this.selectionRect) {
      this.canvasContext.deleteFigure(this.selectionRect);
    }
    if (this.currDx || this.currDy) {
      const currDx = this.currDx,
        currDy = this.currDy;
      this.currDx = 0;
      this.currDy = 0;
      const selectedFigures = [...this.selectedFigures];
      this.canvasContext.addOperation({
        apply: () => {
          selectedFigures.forEach((figure) => figure.translate(currDx, currDy));
        },
        rollback: () => {
          selectedFigures.forEach((figure) =>
            figure.translate(-currDx, -currDy),
          );
        },
      });
    }
  }

  handleMouseMove(x: number, y: number) {
    if (!this.selectedRects || !this.canvasContext.canvas) {
      return;
    }
    if (!this.isSelecting) {
      const point = { x, y };
      const bRect = this.selectedRects.boundingRect;
      const inner = addPadding(bRect, -5, -5);
      const borderLeft = addPadding(
        {
          x1: bRect.x1,
          y1: bRect.y1,
          x2: bRect.x1,
          y2: bRect.y2,
        },
        5,
        -5,
      );
      const borderRight = addPadding(
        {
          x1: bRect.x2,
          y1: bRect.y1,
          x2: bRect.x2,
          y2: bRect.y2,
        },
        5,
        -5,
      );
      const borderTop = addPadding(
        {
          x1: bRect.x1,
          y1: bRect.y1,
          x2: bRect.x2,
          y2: bRect.y1,
        },
        -5,
        5,
      );
      const borderBottom = addPadding(
        {
          x1: bRect.x1,
          y1: bRect.y2,
          x2: bRect.x2,
          y2: bRect.y2,
        },
        -5,
        5,
      );
      const cornerSE = addPadding(
        {
          x1: bRect.x1,
          y1: bRect.y1,
          x2: bRect.x1,
          y2: bRect.y1,
        },
        5,
        5,
      );
      const cornerNE = addPadding(
        {
          x1: bRect.x2,
          y1: bRect.y1,
          x2: bRect.x2,
          y2: bRect.y1,
        },
        5,
        5,
      );
      const cornerSW = addPadding(
        {
          x1: bRect.x1,
          y1: bRect.y2,
          x2: bRect.x1,
          y2: bRect.y2,
        },
        5,
        5,
      );
      const cornerNW = addPadding(
        {
          x1: bRect.x2,
          y1: bRect.y2,
          x2: bRect.x2,
          y2: bRect.y2,
        },
        5,
        5,
      );
      if (isPointInRect(point, cornerSE)) {
        this.canvasContext.canvas.style.cursor = "se-resize";
      } else if (isPointInRect(point, cornerNE)) {
        this.canvasContext.canvas.style.cursor = "ne-resize";
      } else if (isPointInRect(point, cornerSW)) {
        this.canvasContext.canvas.style.cursor = "sw-resize";
      } else if (isPointInRect(point, cornerNW)) {
        this.canvasContext.canvas.style.cursor = "nw-resize";
      } else if (
        isPointInRect(point, borderLeft) ||
        isPointInRect(point, borderRight)
      ) {
        this.canvasContext.canvas.style.cursor = "w-resize";
      } else if (
        isPointInRect(point, borderTop) ||
        isPointInRect(point, borderBottom)
      ) {
        this.canvasContext.canvas.style.cursor = "n-resize";
      } else if (isPointInRect(point, inner)) {
        this.canvasContext.canvas.style.cursor = "move";
      } else {
        this.canvasContext.canvas.style.cursor = "default";
      }
      if (this.position) {
        const dx = x - this.position[0],
          dy = y - this.position[1];
        this.currDx += dx;
        this.currDy += dy;
        this.selectedFigures.forEach((figure) => figure.translate(dx, dy));
        this.position = [x, y];
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
      x2: x,
      y2: y,
    };
    this.selectionRect.addRect(rect);
    this.selectedFigures = this.canvasContext
      .selectFiguresInRect(rect)
      .filter(
        (figure) =>
          figure.id != this.selectionRect?.id &&
          figure.id != this.selectedRects?.id,
      );
    if (this.selectedFigures.length) {
      this.canvasContext.setDefinableStyles([
        "strokeStyle",
        "lineWidth",
        "lineDash",
        "fillStyle",
      ]);
      this.canvasContext.setStyles(this.selectedFigures[0].styles, false);
    } else {
      this.canvasContext.setDefinableStyles([]);
    }
    this.drawSelectedRects();
    this.canvasContext.repaint();
  }

  handleMouseDown(x: number, y: number) {
    this.position = [x, y];
    if (
      this.selectedRects &&
      isPointInRect({ x, y }, this.selectedRects.boundingRect)
    ) {
      this.isSelecting = false;
      return;
    }
    this.canvasContext.setDefinableStyles([]);
    this.isSelecting = true;
    this.selectedFigures = [];
    if (this.selectedRects) {
      this.canvasContext.deleteFigure(this.selectedRects);
    }
    this.selectionRect = new Figure(true);
    this.selectedRects = new Figure(true);
    this.selectionRect.setStyles(SELECTION_STYLES);
    this.selectedRects.setStyles(SELECTED_STYLES);
    this.canvasContext.addFigure(this.selectionRect);
    this.canvasContext.addFigure(this.selectedRects);
  }

  reset() {
    if (this.selectedRects) {
      this.canvasContext.deleteFigure(this.selectedRects);
      this.selectedRects = null;
    }
    if (this.selectionRect) {
      this.canvasContext.deleteFigure(this.selectionRect);
      this.selectionRect = null;
    }
    this.selectedFigures = [];
    this.definableStyles = [];
  }

  updateStyles(styles: Partial<CanvasStyles>) {
    if (this.selectedFigures) {
      const figureStyles = this.selectedFigures.map((figure) => figure.styles);
      const selectedFigures = [...this.selectedFigures];
      this.canvasContext.addOperation({
        apply: () => {
          selectedFigures.forEach((figure) => figure.setStyles(styles));
        },
        rollback: () => {
          selectedFigures.forEach((figure, index) =>
            figure.setStyles(figureStyles[index]),
          );
        },
      });
      this.selectedFigures.forEach((figure) => figure.setStyles(styles));
    }
    this.canvasContext.repaint();
  }

  private drawSelectedRects() {
    if (!this.selectedRects) {
      return;
    }
    this.selectedRects.clear();
    this.selectedFigures.forEach((figure) =>
      this.selectedRects?.addRect(addPadding(figure.boundingRect, 5, 5)),
    );
    this.selectedRects?.addRect(this.selectedRects.boundingRect);
  }
}

export const select = new Select(canvasContext);

export default Select;
