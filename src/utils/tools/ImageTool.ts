import { CanvasStyles } from "../../types/CanvasStyles";
import Tool from "../../types/Tool";
import CanvasContext from "../CanvasContext";
import Figure from "../figure/Figure";
import throttle from "../throttle";

class ImageTool implements Tool {
  cursor: string = "crosshair";
  definableStyles: Array<keyof CanvasStyles> = [];

  private canvasContext: CanvasContext;

  constructor(canvasContext: CanvasContext) {
    this.canvasContext = canvasContext;
    this.handleMouseMove = throttle(this.handleMouseMove, 30);
  }

  handleMouseUp() {}

  handleMouseMove() {}

  handleMouseDown(x: number, y: number) {
    if (!this.canvasContext.context) {
      return;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target) return;
          const figure = new Figure();
          const image = new Image();
          image.onload = () => {
            figure.addImage(image, x, y);
            this.canvasContext.addFigure(figure);
            this.canvasContext.select([figure]);
          };
          image.src = e.target.result as string;
        };
        reader.readAsDataURL(file);
      }

      document.body.removeChild(fileInput);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    setTimeout(() => {
      if (document.body.contains(fileInput)) {
        document.body.removeChild(fileInput);
      }
    }, 5000);
  }
}

export default ImageTool;
