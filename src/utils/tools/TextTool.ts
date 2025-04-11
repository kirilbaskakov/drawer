import { CanvasStyles } from "../../types/CanvasStyles";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import Figure from "../figure/Figure";
import throttle from "../throttle";

class TextTool implements Tool {
  cursor: string = "crosshair";
  definableStyles: Array<keyof CanvasStyles> = ["fontSize", "strokeStyle"];

  private canvasContext: CanvasContext;
  private isTyping = false;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 30);
  }

  handleMouseUp() {}

  handleMouseMove() {}

  handleMouseDown(x: number, y: number, e: MouseEvent) {
    if (!this.canvasContext.context) {
      return;
    }
    if (this.isTyping) {
      this.isTyping = false;
      return;
    }
    this.isTyping = true;
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.overflow = "hidden";
    container.style.top = "0";
    container.style.left = "0";
    container.style.bottom = "0";
    container.style.right = "0";
    const textInput = document.createElement("input");
    textInput.style.padding = "0";
    textInput.style.margin = "0";
    textInput.style.position = "fixed";
    textInput.style.transformOrigin = "top left";
    textInput.style.scale = `${this.canvasContext.scaleFactor} ${this.canvasContext.scaleFactor}`;
    textInput.style.translate = `${e.pageX + "px"} ${e.pageY - 2 + "px"}`;
    textInput.style.backgroundColor = "transparent";
    textInput.style.border = "none";
    textInput.style.outline = "none";
    textInput.style.color = this.canvasContext.styles.strokeStyle;
    textInput.style.fontFamily = this.canvasContext.styles.fontFamily;
    textInput.style.fontSize = this.canvasContext.styles.fontSize;
    textInput.style.overflow = "hidden";
    textInput.style.minWidth = "800px";
    textInput.addEventListener("focus", () => {
      textInput.style.outline = "none";
    });

    textInput.addEventListener("blur", () => {
      const figure = new Figure();

      figure.setStyles(this.canvasContext.styles);
      this.canvasContext.addFigure(figure);
      figure.addText(textInput.value, x, y);
      document.body.removeChild(container);
      this.canvasContext.repaint();
      this.isTyping = false;
    });

    container.appendChild(textInput);
    document.body.appendChild(container);

    requestAnimationFrame(() => textInput.focus());
  }
}

export default TextTool;
