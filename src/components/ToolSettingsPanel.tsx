import Picker from "./Picker";
import "../index.css";
import { canvasContext } from "../utils/CanvasContext";
import {
  FILL_COLORS,
  LINE_DASH,
  LINE_WIDTHS,
  STROKE_COLORS,
} from "../constants/drawingDefaults";
import { observer } from "mobx-react-lite";

const ToolSettingsPanel = observer(() => {
  const updateOptions = (optionName: string) => (value: unknown) => {
    canvasContext.setStyles({ [optionName]: value });
  };

  if (!canvasContext.definableStyles.length) {
    return null;
  }

  return (
    <div className="toolbar toolbar-top-left">
      {canvasContext.definableStyles.includes("strokeStyle") && (
        <Picker
          title={"Обводка"}
          options={STROKE_COLORS.map((color) => ({
            icon: (
              <div
                className="custom-tool-icon"
                style={{ backgroundColor: color }}
              />
            ),
            value: color,
          }))}
          value={canvasContext.styles.strokeStyle}
          onSelect={updateOptions("strokeStyle")}
        />
      )}
      {canvasContext.definableStyles.includes("fillStyle") && (
        <Picker
          title={"Фон"}
          options={FILL_COLORS.map((color) => ({
            icon: (
              <div
                className="custom-tool-icon"
                style={{ backgroundColor: color }}
              />
            ),
            value: color,
          }))}
          value={canvasContext.styles.fillStyle}
          onSelect={updateOptions("fillStyle")}
        />
      )}
      {canvasContext.definableStyles.includes("lineWidth") && (
        <Picker
          title={"Толщина обводки"}
          options={LINE_WIDTHS.map((width, index) => ({
            icon: (
              <div className="custom-tool-icon">
                <div
                  className="line-width-icon"
                  style={{ borderTopWidth: (index + 1) * 2 }}
                />
              </div>
            ),
            value: width,
          }))}
          value={canvasContext.styles.lineWidth}
          onSelect={updateOptions("lineWidth")}
        />
      )}
      {canvasContext.definableStyles.includes("lineDash") && (
        <Picker
          title={"Стиль обводки"}
          options={LINE_DASH.map((dash) => ({
            icon: (
              <div className="custom-tool-icon">
                <div
                  className="line-width-icon"
                  style={{ borderStyle: dash[0] ? "dashed" : "solid" }}
                />
              </div>
            ),
            value: dash,
          }))}
          value={canvasContext.styles.lineDash}
          onSelect={updateOptions("lineDash")}
        />
      )}
    </div>
  );
});

export default ToolSettingsPanel;
