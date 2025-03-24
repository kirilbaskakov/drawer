import {
  DEFAULT_BOUDING_RECT,
  DEFAULT_STYLES,
} from "../constants/drawingDefaults";
import { CanvasStyles } from "../types/CanvasStyles";
import Rect from "../types/Rect";
import Figure from "./figure/Figure";
import Tool from "../types/Tool";
import CanvasOperation from "../types/CanvasOperation";
import { makeAutoObservable } from "mobx";
import { keyComboListener } from "./KeyComboListener";
import KEY_BINDINGS from "../constants/hotkeys";
import updateBoundingRect from "./geometry/updateBoundingRect";
import addPadding from "./geometry/addPadding";
import Select from "./tools/Select";

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
  private lastCursorPosition = [0, 0];

  constructor() {
    makeAutoObservable(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.paste = this.paste.bind(this);
    this.selectAll = this.selectAll.bind(this);

    keyComboListener.subscribe(KEY_BINDINGS.UNDO, this.undo);
    keyComboListener.subscribe(KEY_BINDINGS.REDO, this.redo);
    keyComboListener.subscribe(KEY_BINDINGS.ZOOM_IN, this.zoomIn);
    keyComboListener.subscribe(KEY_BINDINGS.ZOOM_OUT, this.zoomOut);
    keyComboListener.subscribe(KEY_BINDINGS.PASTE, this.paste);
    keyComboListener.subscribe(KEY_BINDINGS.SELECT_ALL, this.selectAll);
  }

  connectCanvas(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    this.canvas.style.backgroundColor = this.canvasColor;
    document.onmouseup = (e) => {
      if (this.activeTool) {
        const [x, y] = this.translateClientPoint(e.pageX, e.pageY);
        this.activeTool.handleMouseUp(x, y, e);
      }
    };
    document.onmousemove = (e) => {
      const [x, y] = this.translateClientPoint(e.pageX, e.pageY);
      this.lastCursorPosition = [x, y];
      if (this.activeTool) {
        this.activeTool.handleMouseMove(x, y, e);
      }
    };
    canvas.onmousedown = (e) => {
      if (this.activeTool) {
        const [x, y] = this.translateClientPoint(e.pageX, e.pageY);
        this.activeTool.handleMouseDown(x, y, e);
      }
    };
    document.onmouseleave = (e) => {
      if (this.activeTool?.handleMouseLeave) {
        const [x, y] = this.translateClientPoint(e.pageX, e.pageY);
        this.activeTool.handleMouseLeave(x, y, e);
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

  delete() {
    keyComboListener.unsubscribe(this.undo);
    keyComboListener.unsubscribe(this.redo);
    keyComboListener.unsubscribe(this.zoomIn);
    keyComboListener.unsubscribe(this.zoomOut);
    keyComboListener.unsubscribe(this.paste);
    keyComboListener.unsubscribe(this.selectAll);
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

  zoomIn() {
    this.zoom(this.scaleFactor + 0.1);
  }

  zoomOut() {
    this.zoom(this.scaleFactor - 0.1);
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

  select(figures: Figure[]) {
    const select = new Select(this);
    this.setActiveTool(select);
    select.select(figures);
  }

  selectAll() {
    this.select(this.figures.filter((figure) => !figure.isAdditional));
  }

  repaint() {
    if (!this.context) {
      return;
    }
    this.context.clearRect(-9999, -9999, 20000, 20000);
    this.figures.forEach((figure) => {
      figure.paint(this.context!);
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

  async paste() {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const imageType = item.types.find((type) => type.startsWith("image"));
      if (imageType) {
        const blob = await item.getType(imageType);
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => {
          const figure = new Figure();
          figure.addImage(
            image,
            this.lastCursorPosition[0] - image.width / 2,
            this.lastCursorPosition[1] - image.height / 2,
          );
          this.addFigure(figure);
          this.select([figure]);
        };
        image.src = url;
        return;
      }
    }

    const json = await navigator.clipboard.readText();
    const obj = JSON.parse(json);

    if (!obj || !obj.figures) {
      return;
    }
    const figures: Figure[] = [];
    const boundingRect: Rect = { ...DEFAULT_BOUDING_RECT };

    for (const figure of obj.figures) {
      const figureParsed = Figure.fromJSON(figure);
      if (figureParsed) {
        figures.push(figureParsed);
        updateBoundingRect(
          boundingRect,
          figureParsed.boundingRect.x1,
          figureParsed.boundingRect.y1,
        );
        updateBoundingRect(
          boundingRect,
          figureParsed.boundingRect.x2,
          figureParsed.boundingRect.y2,
        );
      }
    }
    if (!figures.length) {
      return;
    }
    const w = boundingRect.x2 - boundingRect.x1;
    const h = boundingRect.y2 - boundingRect.y1;
    const translateX = this.lastCursorPosition[0] - boundingRect.x1 - w / 2;
    const translateY = this.lastCursorPosition[1] - boundingRect.y1 - h / 2;
    figures.forEach((figure) => figure.translate(translateX, translateY));
    this.select(figures);
    this.addOperation({
      apply: () => figures.forEach((figure) => this._addFigure(figure)),
      rollback: () => figures.forEach((figure) => this._deleteFigure(figure)),
    });
    figures.forEach((figure) => this._addFigure(figure));
    this.repaint();
  }

  toJSON() {
    const figuresJSON = this.figures
      .filter((figure) => !figure.isAdditional)
      .map((figure) => figure.toJSON());
    return JSON.stringify({
      figures: figuresJSON,
      canvasColor: this.canvasColor,
      styles: this.styles,
    });
  }

  static fromJSON(jsonString: string) {
    const parsedObject = JSON.parse(jsonString);
    if (
      parsedObject.figures &&
      parsedObject.canvasColor &&
      parsedObject.styles
    ) {
      const canvasContext = new CanvasContext();
      canvasContext.setStyles(parsedObject.styles);
      canvasContext.figures = parsedObject.figures.map((figure: string) =>
        Figure.fromJSON(figure),
      );
      canvasContext.setCanvasColor(parsedObject.canvasColor);
      return canvasContext;
    }
  }

  private _addFigure(figure: Figure) {
    this.figures.push(figure);
  }

  private _deleteFigure(figure: Figure) {
    this.figures = this.figures.filter((fig) => fig !== figure);
    this.repaint();
  }

  private translateClientPoint(clientX: number, clientY: number) {
    clientX -= this.offset[0];
    clientY -= this.offset[1];
    clientX /= this.scaleFactor;
    clientY /= this.scaleFactor;
    return [clientX, clientY];
  }
}

export default CanvasContext;
