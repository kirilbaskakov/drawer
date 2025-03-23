import {
  SELECTED_STYLES,
  SELECTION_STYLES,
} from "../../constants/drawingDefaults";
import Rect from "../../types/Rect";
import CanvasContext from "../CanvasContext";
import Figure from "../Figure";
import throttle from "../throttle";
import Tool from "../../types/Tool";
import isPointInRect from "../geometry/isPointInRect";
import { CanvasStyles } from "../../types/CanvasStyles";
import addPadding from "../geometry/addPadding";
import KEY_BINDINGS from "../../constants/hotkeys";
import { keyComboListener } from "../KeyComboListener";
import Point from "../../types/Point";
import ScaleType from "../../types/ScaleType";

type ActionType = null | "selecting" | "move" | ScaleType;

class Select implements Tool {
  cursor: string = "default";
  definableStyles: Array<keyof CanvasStyles> = [];

  private canvasContext: CanvasContext;
  private position: [number, number] | null = null;
  private selectedRects: Figure | null = null;
  private selectionRect: Figure | null = null;
  private selectedFigures: Figure[] = [];
  private currAction: ActionType = null;
  private currDx = 0;
  private currDy = 0;
  private currScaleX = 1;
  private currScaleY = 1;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 50);

    this.delete = this.delete.bind(this);
    this.copy = this.copy.bind(this);
    this.cut = this.cut.bind(this);

    keyComboListener.subscribe(KEY_BINDINGS.DELETE, this.delete);

    keyComboListener.subscribe(KEY_BINDINGS.COPY, this.copy);

    keyComboListener.subscribe(KEY_BINDINGS.CUT, this.cut);
  }

  handleMouseUp() {
    this.position = null;
    if (this.selectionRect) {
      this.canvasContext.deleteFigure(this.selectionRect);
    }
    if (this.currAction == "move") {
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
    if (this.currAction?.includes("resize")) {
      const currScaleX = this.currScaleX;
      const currScaleY = this.currScaleY;
      const selectedFigures = [...this.selectedFigures];
      const action = this.currAction;
      this.currScaleX = 1;
      this.currScaleY = 1;
      this.canvasContext.addOperation({
        apply: () =>
          selectedFigures.forEach((figure) =>
            figure.scale(currScaleX, currScaleY, this.currAction as ScaleType),
          ),
        rollback: () =>
          selectedFigures.forEach((figure) =>
            figure.scale(1 / currScaleX, 1 / currScaleY, action as ScaleType),
          ),
      });
    }
    this.currAction = null;
  }

  handleMouseMove(x: number, y: number) {
    this.updateCursor({ x, y });
    if (!this.selectedRects || !this.canvasContext.canvas || !this.position) {
      return;
    }
    if (this.currAction == "move") {
      const dx = x - this.position[0],
        dy = y - this.position[1];
      this.currDx += dx;
      this.currDy += dy;
      this.selectedFigures.forEach((figure) => figure.translate(dx, dy));
      this.position = [x, y];
      this.selectedRects.translate(dx, dy);
      this.canvasContext.repaint();
      return;
    }
    if (this.currAction?.includes("resize")) {
      const w =
        this.selectedRects.boundingRect.x2 - this.selectedRects.boundingRect.x1;
      const h =
        this.selectedRects.boundingRect.y2 - this.selectedRects.boundingRect.y1;
      let scaleX = 1,
        scaleY = 1;
      if (
        this.currAction == "n-resize" ||
        this.currAction == "nw-resize" ||
        this.currAction == "sw-resize"
      ) {
        scaleY = (h + (y - this.position[1])) / h;
      } else if (
        this.currAction == "s-resize" ||
        this.currAction == "se-resize" ||
        this.currAction == "ne-resize"
      ) {
        scaleY = (h + (this.position[1] - y)) / h;
      }
      if (
        this.currAction == "w-resize" ||
        this.currAction == "ne-resize" ||
        this.currAction == "nw-resize"
      ) {
        scaleX = (w + (x - this.position[0])) / w;
      } else if (
        this.currAction == "e-resize" ||
        this.currAction == "se-resize" ||
        this.currAction == "sw-resize"
      ) {
        scaleX = (w + (this.position[0] - x)) / w;
      }
      this.selectedFigures.forEach((figure) =>
        figure.scale(scaleX, scaleY, this.currAction as ScaleType),
      );
      this.position = [x, y];
      this.currScaleX *= scaleX;
      this.currScaleY *= scaleY;
      this.selectedRects.scale(scaleX, scaleY, this.currAction as ScaleType);
      this.canvasContext.repaint();
      return;
    }
    if (!this.selectionRect) {
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
    this.select(
      this.canvasContext
        .selectFiguresInRect(rect)
        .filter(
          (figure) =>
            figure.id != this.selectionRect?.id &&
            figure.id != this.selectedRects?.id,
        ),
    );
  }

  handleMouseDown(x: number, y: number) {
    this.position = [x, y];
    this.currAction = this.getActionType({ x, y });
    if (this.currAction != "selecting") {
      return;
    }
    this.canvasContext.setDefinableStyles([]);
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
    keyComboListener.unsubscribe(this.copy);
    keyComboListener.unsubscribe(this.cut);
    keyComboListener.unsubscribe(this.delete);
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

  select(figures: Figure[]) {
    this.selectedFigures = figures;
    if (this.selectedFigures.length) {
      this.canvasContext.setDefinableStyles([
        "strokeStyle",
        "lineWidth",
        "lineDash",
        "fillStyle",
        "fontSize",
      ]);
      this.canvasContext.setStyles(this.selectedFigures[0].styles, false);
    } else {
      this.canvasContext.setDefinableStyles([]);
    }
    this.drawSelectedRects();
    this.canvasContext.repaint();
  }

  private drawSelectedRects() {
    if (!this.selectedRects) {
      this.selectedRects = new Figure(true);
      this.selectedRects.setStyles(SELECTED_STYLES);
      this.canvasContext.addFigure(this.selectedRects);
    }
    this.selectedRects.clear();
    this.selectedFigures.forEach((figure) =>
      this.selectedRects?.addRect(addPadding(figure.boundingRect, 5, 5)),
    );
    this.selectedRects.addRect(this.selectedRects.boundingRect, {
      lineDash: [5],
    });
  }

  private updateCursor(point: Point) {
    if (!this.canvasContext.canvas) {
      return;
    }
    const action = this.getActionType(point);
    switch (action) {
      case "selecting":
      case null:
        this.canvasContext.canvas.style.cursor = "default";
        break;
      default:
        this.canvasContext.canvas.style.cursor = action;
        break;
    }
  }

  private getActionType(point: Point): ActionType {
    if (!this.selectedRects) {
      return "selecting";
    }
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
      return "se-resize";
    }
    if (isPointInRect(point, cornerNE)) {
      return "ne-resize";
    }
    if (isPointInRect(point, cornerSW)) {
      return "sw-resize";
    }
    if (isPointInRect(point, cornerNW)) {
      return "nw-resize";
    }
    if (isPointInRect(point, borderLeft)) {
      return "e-resize";
    }
    if (isPointInRect(point, borderRight)) {
      return "w-resize";
    }
    if (isPointInRect(point, borderTop)) {
      return "s-resize";
    }
    if (isPointInRect(point, borderBottom)) {
      return "n-resize";
    }
    if (isPointInRect(point, inner)) {
      return "move";
    }
    return "selecting";
  }

  private copy() {
    if (!this.selectedFigures.length) {
      return;
    }
    const figuresJSON = this.selectedFigures.map((figure) => figure.toJSON());
    navigator.clipboard.writeText(JSON.stringify({ figures: figuresJSON }));
  }

  private cut() {
    this.copy();
    this.delete();
  }

  private delete() {
    if (this.selectedFigures.length) {
      this.canvasContext.deleteFigures(this.selectedFigures);
      this.reset();
    }
  }
}

export default Select;
