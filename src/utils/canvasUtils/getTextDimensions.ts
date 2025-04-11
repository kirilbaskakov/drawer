function getTextDimensions(text: string, font: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context!.font = font;
  const metrics = context!.measureText(text);
  const width = metrics.width;
  const height = parseInt(font, 10);
  return { width, height };
}

export default getTextDimensions;
