import { CanvasStyles } from "../../types/CanvasStyles";

const applyStyles = (
  context: CanvasRenderingContext2D,
  styles: Partial<CanvasStyles>,
) => {
  if (styles.strokeStyle) context.strokeStyle = styles.strokeStyle;
  if (styles.lineWidth) context.lineWidth = styles.lineWidth;
  if (styles.lineDash) context.setLineDash(styles.lineDash);
  if (styles.fillStyle) context.fillStyle = styles.fillStyle;
  if (styles.fontSize && styles.fontFamily)
    context.font = styles.fontSize + " " + styles.fontFamily;
};

export default applyStyles;
