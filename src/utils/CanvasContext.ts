import { DEFAULT_STYLES } from "../constants/drawingDefaults";
import { CanvasStyles } from "../types/CanvasStyles";
import Rect from "../types/Rect";
import Figure from "./Figure";
import Tool from "../types/Tool";

class CanvasContext extends EventTarget {
  context: CanvasRenderingContext2D | null = null;
  activeTool: Tool | null = null;
  figures: Figure[] = [];
  offset: [number, number] = [0, 0];
  styles: CanvasStyles = DEFAULT_STYLES;
  canvas: HTMLCanvasElement | null = null;
  scaleFactor = 1;

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

  zoom(zoom: number) {
    if (!this.context) return;
    this.context.scale(zoom / this.scaleFactor, zoom / this.scaleFactor);
    this.scaleFactor = zoom;
    this.repaint();
  }

  setStyles(styles: Partial<CanvasStyles>) {
    this.styles = { ...this.styles, ...styles };
    if (this.activeTool?.updateStyles) {
      this.activeTool?.updateStyles(styles);
    }
  }

  setActiveTool(tool: Tool) {
    if (this.activeTool?.reset) {
      this.activeTool.reset();
    }
    this.activeTool = tool;
    if (this.canvas) {
      this.canvas.style.cursor = tool.cursor;
    }
  }

  addFigure(figure: Figure) {
    this.figures.push(figure);
  }

  selectFiguresIntersectRect(rect: Rect) {
    return this.figures.filter((figure) => figure.intersectWith(rect));
  }

  selectFiguresInRect(rect: Rect) {
    return this.figures.filter((figure) => figure.containsIn(rect));
  }

  deleteFigure(figure: Figure) {
    figure.clearBoundingRect();
    this.figures = this.figures.filter((fig) => fig !== figure);
    this.repaint();
  }

  translate(clientDx: number, clientDy: number) {
    this.context?.translate(clientDx, clientDy);
    this.offset[0] += clientDx * this.scaleFactor;
    this.offset[1] += clientDy * this.scaleFactor;
    this.repaint();
  }

  repaint() {
    this.context?.clearRect(-9999, -9999, 20000, 20000);
    this.figures.forEach((figure) => {
      figure.repaint();
    });
  }
}

export const canvasContext = new CanvasContext();

export default CanvasContext;
