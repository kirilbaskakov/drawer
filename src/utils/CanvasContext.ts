import {
  DEFAULT_BOUDING_RECT,
  DEFAULT_STYLES,
} from "../constants/drawingDefaults";
import { CanvasStyles } from "../types/CanvasStyles";
import Rect from "../types/Rect";
import Figure from "./Figure";
import Tool from "../types/Tool";
import CanvasOperation from "../types/CanvasOperation";
import { makeAutoObservable } from "mobx";
import { keyComboListener } from "./KeyComboListener";
import KEY_BINDINGS from "../constants/hotkeys";
import updateBoundingRect from "./geometry/updateBoundingRect";
import addPadding from "./geometry/addPadding";

class CanvasContext {
  context: CanvasRenderingContext2D | null = null;
  activeTool: Tool | null = null;
  figures: Figure[] = [];
  offset: [number, number] = [0, 0];
  styles: CanvasStyles = DEFAULT_STYLES;
  canvas: HTMLCanvasElement | null = null;
  scaleFactor = 1;
  definableStyles: Array<keyof CanvasStyles> = [];
  canvasColor: string = "#fff";
  private undoStack: CanvasOperation[] = [];
  private redoStack: CanvasOperation[] = [];

  constructor() {
    makeAutoObservable(this);
    keyComboListener.subscribe(KEY_BINDINGS.UNDO, () => this.undo());
    keyComboListener.subscribe(KEY_BINDINGS.REDO, () => this.redo());
    keyComboListener.subscribe(KEY_BINDINGS.ZOOM_IN, () =>
      this.zoom(this.scaleFactor + 0.1),
    );
    keyComboListener.subscribe(KEY_BINDINGS.ZOOM_OUT, () =>
      this.zoom(this.scaleFactor - 0.1),
    );
  }

  connectCanvas(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    canvas.onmouseup = (e) => {
      if (this.activeTool) {
        this.activeTool.handleMouseUp(e);
      }
    };
    canvas.onmousemove = (e) => {
      if (this.activeTool) {
        this.activeTool.handleMouseMove(e);
      }
    };
    canvas.onmousedown = (e) => {
      if (this.activeTool) {
        this.activeTool.handleMouseDown(e);
      }
    };
    canvas.onmouseleave = (e) => {
      if (this.activeTool?.handleMouseLeave) {
        this.activeTool.handleMouseLeave(e);
      }
    };
  }

  clear() {
    this.context?.clearRect(-9999, -9999, 20000, 20000);
    this.figures = [];
    this.canvasColor = "#fff";
    this.setActiveTool(null);
    this.undoStack = [];
    this.redoStack = [];
  }

  export() {
    if (!this.canvas || !this.context) {
      return "";
    }

    let boundingRect = { ...DEFAULT_BOUDING_RECT };
    this.figures.forEach((figure) => {
      if (figure.isAdditional) {
        return;
      }
      const { x1, y1, x2, y2 } = figure.boundingRect;
      updateBoundingRect(boundingRect, x1, y1);
      updateBoundingRect(boundingRect, x2, y2);
    });
    boundingRect = addPadding(boundingRect, 10, 10);
    const zoom = this.scaleFactor;
    const offset = [...this.offset];
    this.zoom(1);
    this.translate(-this.offset[0], -this.offset[1]);
    const zoomX = this.canvas.clientWidth / (boundingRect.x2 - boundingRect.x1);
    const zoomY =
      this.canvas.clientHeight / (boundingRect.y2 - boundingRect.y1);
    this.zoom(Math.min(zoomX, zoomY));
    this.translate(-boundingRect.x1, -boundingRect.y1);
    const data = this.canvas.toDataURL("image/png");
    this.translate(boundingRect.x1, boundingRect.y1);
    this.zoom(1);
    this.zoom(zoom);
    this.translate(offset[0], offset[1]);
    return data;
  }

  zoom(zoom: number) {
    if (!this.context) return;
    this.context.scale(zoom / this.scaleFactor, zoom / this.scaleFactor);
    this.scaleFactor = zoom;
    this.repaint();
  }

  setDefinableStyles(definableStyles: Array<keyof CanvasStyles>) {
    this.definableStyles = definableStyles;
  }

  setStyles(styles: Partial<CanvasStyles>, updateStyles = true) {
    this.styles = { ...this.styles, ...styles };
    if (updateStyles && this.activeTool?.updateStyles) {
      this.activeTool?.updateStyles(styles);
    }
  }

  setCanvasColor(canvasColor: string) {
    this.canvasColor = canvasColor;
    if (this.canvas) {
      this.canvas.style.backgroundColor = canvasColor;
    }
  }

  setActiveTool(tool: Tool | null) {
    if (this.activeTool?.reset) {
      this.activeTool.reset();
    }
    if (!tool) {
      return;
    }
    this.activeTool = tool;
    this.setDefinableStyles(tool.definableStyles);
    if (this.canvas) {
      this.canvas.style.cursor = tool.cursor;
    }
  }

  addFigure(figure: Figure) {
    this._addFigure(figure);
    if (!figure.isAdditional) {
      this.addOperation({
        apply: () => this._addFigure(figure),
        rollback: () => this._deleteFigure(figure),
      });
    }
  }

  addFigures(figures: Figure[]) {
    figures.forEach((figure) => this._addFigure(figure));
    this.addOperation({
      apply: () => figures.forEach((figure) => this._addFigure(figure)),
      rollback: () => figures.forEach((figure) => this._deleteFigure(figure)),
    });
  }

  selectFiguresIntersectRect(rect: Rect) {
    return this.figures.filter((figure) => figure.intersectWith(rect));
  }

  selectFiguresInRect(rect: Rect) {
    return this.figures.filter((figure) => figure.containsIn(rect));
  }

  deleteFigure(figure: Figure) {
    this._deleteFigure(figure);
    if (!figure.isAdditional) {
      this.addOperation({
        apply: () => this._deleteFigure(figure),
        rollback: () => this._addFigure(figure),
      });
    }
  }

  deleteFigures(figures: Figure[]) {
    figures.forEach((figure) => this._deleteFigure(figure));
    this.addOperation({
      apply: () => figures.forEach((figure) => this._deleteFigure(figure)),
      rollback: () => figures.forEach((figure) => this._addFigure(figure)),
    });
  }

  translate(clientDx: number, clientDy: number) {
    this.context?.translate(clientDx, clientDy);
    this.offset[0] += clientDx * this.scaleFactor;
    this.offset[1] += clientDy * this.scaleFactor;
    this.repaint();
  }

  repaint() {
    this.context?.clearRect(-9999, -9999, 20000, 20000);
    console.log(this.figures);
    this.figures.forEach((figure) => {
      figure.repaint();
    });
  }

  addOperation(operation: CanvasOperation) {
    this.undoStack.push(operation);
    this.redoStack = [];
  }

  get canUndo() {
    return !!this.undoStack.length;
  }

  get canRedo() {
    return !!this.redoStack.length;
  }

  undo() {
    if (this.activeTool?.reset) {
      this.activeTool.reset();
    }
    const operation = this.undoStack.pop();
    if (!operation) {
      return;
    }
    operation.rollback();
    this.redoStack.push(operation);
    this.repaint();
  }

  redo() {
    if (this.activeTool?.reset) {
      this.activeTool.reset();
    }
    const operation = this.redoStack.pop();
    if (!operation) {
      return;
    }
    operation.apply();
    this.undoStack.push(operation);
    this.repaint();
  }

  private _addFigure(figure: Figure) {
    this.figures.push(figure);
  }

  private _deleteFigure(figure: Figure) {
    figure.clearBoundingRect();
    this.figures = this.figures.filter((fig) => fig !== figure);
    this.repaint();
  }
}

export const canvasContext = new CanvasContext();

export default CanvasContext;
