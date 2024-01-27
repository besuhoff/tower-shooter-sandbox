import { Dimensions } from './Dimensions';
import { Point } from './Point';

export interface PointRenderer {
    clearRect(point: Point, dimensions: Dimensions): void;
    renderPoint(point: Point, color?: string): void;
}
