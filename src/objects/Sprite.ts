import { Dimensions } from "../types/Dimensions";
import { Point } from "../types/Point";
import { CollisionBox } from "../types/CollisionBox";
import { SpriteImage } from "./SpriteImage";

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
  ) {
    this.collisionBox = collisionBox;
    this._centerBottomCoords = spaceCoords;
    this._imageMapById = images.reduce((accum, image) => {
      accum[image.id] = image;
      return accum;
    }, {} as Record<string, SpriteImage>);
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
}
