import { Dimensions } from './Dimensions';
import { Point } from './Point';

export interface CollisionBox {
    readonly leftTopCoords: Point;
    readonly dimensions: Dimensions;
}
