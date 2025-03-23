import Picker from "./Picker";
import "../index.css";
import {
  FILL_COLORS,
  FONT_SIZES,
  LINE_DASH,
  LINE_WIDTHS,
  STROKE_COLORS,
} from "../constants/drawingDefaults";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import useCanvasContext from "../hooks/useCanvasContext";

const ToolSettingsPanel = observer(() => {
  const { t } = useTranslation();
  const { canvasContext } = useCanvasContext();

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
          title={t("stroke")}
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
          title={t("background")}
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
          title={t("lineWidth")}
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
          title={t("strokeStyle")}
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
      {canvasContext.definableStyles.includes("fontSize") && (
        <Picker
          title={t("fontSize")}
          options={FONT_SIZES.map(([fontSize, label]) => ({
            icon: <div className="custom-tool-icon">{label}</div>,
            value: fontSize,
          }))}
          value={canvasContext.styles.fontSize}
          onSelect={updateOptions("fontSize")}
        />
      )}
    </div>
  );
});

export default ToolSettingsPanel;
