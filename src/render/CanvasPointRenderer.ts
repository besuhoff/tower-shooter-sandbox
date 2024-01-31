import { Dimensions } from "../types/Dimensions";
import { Point } from "../types/Point";
import { PointRenderer } from "../types/PointRenderer";
import { CanvasRenderer } from "./CanvasRenderer";

export class CanvasPointRenderer extends CanvasRenderer implements PointRenderer {
  clearRect({ x, y }: Point, { width, height }: Dimensions) {
    this._renderContext.clearRect(x, y, width, height);
  }
  
  renderPoint({ x, y }: Point, color?: string): void {
    if (!color) {
      return;
    }
    this._renderContext.fillStyle = color;
    this._renderContext.fillRect(x, y, 1, 1);
  }
}
