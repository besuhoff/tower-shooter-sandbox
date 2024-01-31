import { Point } from "../types/Point";
import { CollisionBox } from "../types/CollisionBox";
import { SpriteImage } from "./SpriteImage";
import { keyBy } from "lodash";
import { SpriteRendererOptions } from "../types/SpriteRendererOptions";

export class Sprite {
  readonly collisionBox: CollisionBox | null;
  private _centerBottomCoords: Point;
  private _imageMapById: Record<string, SpriteImage>;
  private _animationMapById: Record<string, SpriteImage>;

  constructor(
    spaceCoords: Point,
    images: SpriteImage[],
    animations: SpriteImage[],
    collisionBox: CollisionBox,
    private _renderers: SpriteRendererOptions,
  ) {
    this.collisionBox = collisionBox;
    this._centerBottomCoords = spaceCoords;
    this._imageMapById = keyBy(images, 'id');
    this._animationMapById = keyBy(animations, 'id');
  }

  getCollisionPointsArray(): Point[] {
    const points = [];
    const collisionBoxTopLeft: Point = {
      x: this._centerBottomCoords.x + this.collisionBox.leftTopCoords.x,
      y: this._centerBottomCoords.y + this.collisionBox.leftTopCoords.y,
    };

    for (let x = 0; x < this.collisionBox.dimensions.width; x++) {
      for (let y = 0; y < this.collisionBox.dimensions.height; y++) {
        points.push({
          x: collisionBoxTopLeft.x + x,
          y: collisionBoxTopLeft.y + y,
        });
      }
    }

    return points;
  }

  move({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) {
    this._centerBottomCoords = {
      x: this._centerBottomCoords.x + dx,
      y: this._centerBottomCoords.y + dy,
    };
  }

  get centerBottomCoords(): Point {
    return this._centerBottomCoords;
  }

  get images(): SpriteImage[] {
    return Object.values(this._imageMapById);
  }

  getImageById(id: string): SpriteImage {
    return this._imageMapById[id];
  }

  getAnimationById(id: string): SpriteImage {
    return this._animationMapById[id];
  }

  renderImage(id: string) {
    this._renderers.imageRenderer.renderImage(this.centerBottomCoords, this._imageMapById[id]);
  }

  renderAnimation(id: string) {
    this._renderers.animationRenderer.renderImage(this.centerBottomCoords, this._animationMapById[id]);
  }
}
