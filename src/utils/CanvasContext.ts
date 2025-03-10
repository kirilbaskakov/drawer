import Rect from "../types/Rect";
import Figure from "./Figure";
import Tool from "./Tool";

class CanvasContext extends EventTarget {
  context: CanvasRenderingContext2D | null = null;
  activeTool: Tool | null = null;
  figures: Figure[] = [];
  offset: [number, number] = [0, 0];

  connectCanvas(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d");
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
  }

  setActiveTool(tool: Tool) {
    this.activeTool = tool;
    console.log(this.activeTool === tool);
  }

  addFigure(figure: Figure) {
    this.figures.push(figure);
  }

  selectFiguresIntersectRect(rect: Rect) {
    return this.figures.filter((figure) => figure.intersectWith(rect));
  }

  selectFiguresInRect(rect: Rect) {
    return this.figures.filter((figures) => figures.containsIn(rect));
  }

  deleteFigure(figure: Figure) {
    figure.clearBoundingRect();
    this.figures = this.figures.filter((fig) => fig !== figure);
    this.repaint();
  }

  translate(dx: number, dy: number) {
    this.context?.translate(dx, dy);
    this.offset[0] += dx;
    this.offset[1] += dy;
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
