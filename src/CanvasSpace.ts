import { createCanvas } from "./helpers/createCanvas";
import { Dimensions } from "./types/Dimensions";
import { Point } from "./types/Point";
import { CanvasPointRenderer } from "./render/CanvasPointRenderer";
import { PixelMatrix } from "./PixelMatrix";
import { Tank } from "./objects/Tank";
import { Sprite } from "./objects/Sprite";
import { CanvasImageRenderer } from "./render/CanvasImageRenderer";
import { Direction } from "./types/Direction";
import { Color } from "./types/Color";
import { HtmlImageRenderer } from "./render/HtmlImageRenderer";

export class CanvasSpace {
  readonly width: number;
  readonly height: number;

  private _pixelMatrix: PixelMatrix;
  private _canvasImageRenderer: CanvasImageRenderer;
  private _htmlImageRenderer: HtmlImageRenderer;
  private _tanks: Tank[] = [];
  private _currentPlayerIndex = 0;

  constructor({ width, height }: Dimensions, container: HTMLElement) {
    const pointCanvas = createCanvas(
      { width, height },
      "game-canvas-point",
      container
    );
    const pointRenderer = new CanvasPointRenderer(pointCanvas);
    this._pixelMatrix = new PixelMatrix({ width, height }, pointRenderer);

    const spriteCanvas = createCanvas(
      { width, height },
      "game-canvas-sprite",
      container
    );
    this._canvasImageRenderer = new CanvasImageRenderer(spriteCanvas);

    const htmlImageContainer = document.createElement('div');
    htmlImageContainer.id = 'html-image-container';
    htmlImageContainer.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    `;

    container.appendChild(htmlImageContainer);
    this._htmlImageRenderer = new HtmlImageRenderer(htmlImageContainer);

    this.width = width;
    this.height = height;
  }

  addSparseSandSquare(point: Point, radius?: number): void {
    return this._pixelMatrix.addSparseSandSquare(point, radius);
  }

  eraseSandSquare(point: Point, radius?: number): void {
    return this._pixelMatrix.eraseSandSquare(point, radius);
  }

  addTank({ position, color }: { position: Point; color?: Color }) {
    const tank = new Tank({
      position,
      color,
      imageRenderer: this._canvasImageRenderer,
      animationRenderer: this._htmlImageRenderer,
    });
    this._pixelMatrix.addDroppingObject(position, tank);
    this._tanks.push(tank);
  }

  rotateTankTrunk(direction: Direction) {
    this._tanks[this._currentPlayerIndex].rotateTrunk(direction);
    this.renderSprites();
  }

  updateSimulation() {
    this._pixelMatrix.updateSimulation();
  }

  renderSprites() {
    this._canvasImageRenderer.clear();
    this._tanks.forEach(tank => tank.render());
  }

  render() {
    this._pixelMatrix.render();
    this.renderSprites();
  }

  shoot() {
    if (!this._tanks.length) {
      return;
    }

    this._tanks[this._currentPlayerIndex].shoot();
    this._currentPlayerIndex =
      (this._currentPlayerIndex + 1) % this._tanks.length;
  }
}
