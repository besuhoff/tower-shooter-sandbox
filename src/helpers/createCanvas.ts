import { Dimensions } from "../types/Dimensions";

export const createCanvas = (
  { width, height }: Dimensions,
  id: string,
  container: HTMLElement = document.body,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", `${width}`);
  canvas.setAttribute("height", `${height}`);
  canvas.id = id;
  container.appendChild(canvas);

  return canvas;
};
