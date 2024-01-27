import { Dimensions } from './types/Dimensions';
import { Point } from './types/Point';
import { CollisionBox } from './types/CollisionBox';


export class Sprite {
    readonly collisionBox: CollisionBox | null;
    private _centerBottomCoords: Point;
    readonly image: HTMLImageElement;

    constructor(coords: Point, imageUrl: string, collisionBox: CollisionBox) {
        this.collisionBox = collisionBox;
        this.image = new Image();
        this.image.src = imageUrl;
        this._centerBottomCoords = coords;
    }

    getCollisionPointsArray(): Point[] {
        const points = [];
        const collisionBoxTopLeft: Point = {
            x: this._centerBottomCoords.x + this.collisionBox.leftTopCoords.x,
            y: this._centerBottomCoords.y + this.collisionBox.leftTopCoords.y,
        };

        for (let x = 0; x < this.collisionBox.dimensions.width; x++) {
            for (let y = 0; y < this.collisionBox.dimensions.height; y++) {
                points.push({ x: collisionBoxTopLeft.x + x, y: collisionBoxTopLeft.y + y });
            }
        }

        return points;
    }

    move({ dx = 0, dy = 0 }: { dx?: number; dy?: number; }) {
        this._centerBottomCoords = {
            x: this._centerBottomCoords.x + dx,
            y: this._centerBottomCoords.y + dy,
        };
    }

    get centerBottomCoords(): Point {
        return this._centerBottomCoords;
    }

    getImageCoordinates(): { coords: Point; dimensions: Dimensions; } {
        const width = this.image.width;
        const height = this.image.height;
        const x = this.centerBottomCoords.x - width / 2;
        const y = this.centerBottomCoords.y - height;

        return {
            coords: { x, y },
            dimensions: { width, height },
        };
    }
}
