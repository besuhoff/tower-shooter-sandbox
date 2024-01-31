import { FlipDirections } from "../types/FlipDirections";
import { Point } from "../types/Point";

type SpriteImageOptions = {
  rotation?: number;
  rotationCenterCoords?: Point;
  flipped?: FlipDirections;
  animationDuration?: number;
};

export class SpriteImage {
  readonly imageElement: HTMLImageElement;
  readonly rotationCenterCoords: Point;
  readonly animationDuration: number;
  private _rotation = 0;
  private _flipped: FlipDirections;

  constructor(
    readonly id: string,
    readonly url: string,
    readonly coords: Point,
    options?: SpriteImageOptions
  ) {
    const {
      rotation = 0,
      rotationCenterCoords = { x: 0, y: 0 },
      flipped = FlipDirections.None,
      animationDuration = null,
    } = options;

    this._rotation = rotation;
    this.rotationCenterCoords = rotationCenterCoords;
    this._flipped = flipped;
    this.animationDuration = animationDuration;
    
    this.imageElement = new Image();
    this.imageElement.src = url;
  }

  updateImage(url: string) {
    this.imageElement.src = url;
  }

  rotate(degree: number) {
    this._rotation = degree;
  }

  flip(direction: FlipDirections) {
    this._flipped = this._flipped ^ direction;
  }

  get rotation(): number {
    return this._rotation;
  }

  get flippedHorizontally(): boolean {
    return Boolean(this._flipped & FlipDirections.Horizontal);
  }

  get flippedVertically(): boolean {
    return Boolean(this._flipped & FlipDirections.Vertical);
  }
}
