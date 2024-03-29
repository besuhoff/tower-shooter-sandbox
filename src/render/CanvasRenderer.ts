import { Renderer } from "../types/Renderer";

export abstract class CanvasRenderer implements Renderer {
  protected _renderContext: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this._renderContext = canvas.getContext("2d");
    if (!this._renderContext) {
      throw new Error("Could not render as the context is not ready");
      return;
    }
  }

  clear() {
    this._renderContext.clearRect(
      0,
      0,
      this._renderContext.canvas.width,
      this._renderContext.canvas.height
    );
  }
}
