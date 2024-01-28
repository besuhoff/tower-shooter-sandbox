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

export class CanvasSpace {
  readonly width: number;
  readonly height: number;

  private _pixelMatrix: PixelMatrix;
  private _sprites: Sprite[] = [];
  private _spriteRenderer: CanvasImageRenderer;
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
    this._spriteRenderer = new CanvasImageRenderer(spriteCanvas);

    this.width = width;
    this.height = height;
  }

  private _renderSprite(sprite: Sprite): void {
    sprite.images.forEach(image => {
        this._spriteRenderer.renderImage(sprite.centerBottomCoords, image);
    });
  }

  addSparseSandSquare(point: Point, radius?: number): void {
    return this._pixelMatrix.addSparseSandSquare(point, radius);
  }

  eraseSandSquare(point: Point, radius?: number): void {
    return this._pixelMatrix.eraseSandSquare(point, radius);
  }

  addTank({ position, color }: { position: Point, color?: Color }) {
    const tank = new Tank({ position, color });
    this._pixelMatrix.addDroppingObject(position, tank);
    this._sprites.push(tank.sprite);
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
    this._spriteRenderer.clear();
    this._sprites.forEach((sprite) => this._renderSprite(sprite));
  }

  render() {
    this._pixelMatrix.render();
    this.renderSprites();
  }

  shoot() {
    this._currentPlayerIndex = (this._currentPlayerIndex + 1) % this._tanks.length;
  }
}
