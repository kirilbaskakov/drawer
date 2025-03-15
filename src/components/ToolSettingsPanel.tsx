import Picker from "./Picker";
import "../index.css";
import { canvasContext } from "../utils/CanvasContext";
import {
  DEFAULT_STYLES,
  FILL_COLORS,
  LINE_DASH,
  LINE_WIDTHS,
  STROKE_COLORS,
} from "../constants/drawingDefaults";

const ToolSettingsPanel = () => {
  const updateOptions = (optionName: string) => (value: unknown) => {
    canvasContext.setStyles({ [optionName]: value });
  };

  return (
    <div className="toolbar toolbar-top-left">
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
        defaultValue={DEFAULT_STYLES.strokeStyle}
        onSelect={updateOptions("strokeStyle")}
      />
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
        defaultValue={DEFAULT_STYLES.fillStyle}
        onSelect={updateOptions("fillStyle")}
      />
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
        defaultValue={DEFAULT_STYLES.lineWidth}
        onSelect={updateOptions("lineWidth")}
      />
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
        defaultValue={DEFAULT_STYLES.lineDash}
        onSelect={updateOptions("lineDash")}
      />
    </div>
  );
};

export default ToolSettingsPanel;
