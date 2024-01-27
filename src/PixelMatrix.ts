import { clamp } from 'lodash';
import { Material } from './materials';
import { AirMaterial } from './materials';
import { getSandMaterial } from './materials';
import { getCollisionBoxMaterial } from './materials';
import { Dimensions } from './types/Dimensions';
import { Point } from './types/Point';
import { PointRenderer } from './types/PointRenderer';
import { DroppingObject } from './types/DroppingObject';

export class PixelMatrix {
    readonly width: number;
    readonly height: number;

    private static CHUNK_SIZE = 20;
    private _materialMatrix: Material[];
    private _matrixUpdatedChunks: Record<string, Point> = {};
    private _droppingObjects: Record<string, DroppingObject> = {};
    private _lastUpdateTimestamp: number;

    constructor({ width, height }: Dimensions, private _renderer: PointRenderer) {
        this.width = width;
        this.height = height;

        this._materialMatrix = new Array(height * width).fill(AirMaterial);
        this._renderRegion();
    }

    private _getCell(point: Point) {
        return this._materialMatrix[this.width * point.y + point.x];
    }

    private _setCell(point: Point, material: Material) {
        this._materialMatrix[this.width * point.y + point.x] = material;
    }

    private _withinBoundaries({ x, y }: Point): boolean {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
    }

    private _normalizeCoordinates(point: Point): Point {
        const x = Math.floor(point.x);
        const y = Math.floor(point.y);

        if (!this._withinBoundaries({ x, y })) {
            throw new RangeError(`Point {${x}, ${y}} is out of boundaries`);
        }

        return { x, y };
    }

    private _getChunkForPoint(point: Point): Point {
        const exactPoint = this._normalizeCoordinates(point);
        return { x: exactPoint.x - exactPoint.x % PixelMatrix.CHUNK_SIZE, y: exactPoint.y - exactPoint.y % PixelMatrix.CHUNK_SIZE };
    }

    private _getAvailableDropDeltaYForPoints(points: Point[], expectedDropDeltaY: number, cellMaterial: Material) {
        if (!points.length) {
            throw new RangeError('Can not drop empty points array');
        }

        let lowestY = points[0].y;
        let bottomLinePoints = points;

        if (points.length > 1) {
            const lowestPointsByXMap = points.reduce((accum, point) => {
                if (!accum[`${point.x}`] || accum[`${point.x}`] < point.y) {
                    accum[`${point.x}`] = point.y;
                }

                return accum;
            }, {} as Record<string, number>);

            bottomLinePoints = Object.entries(lowestPointsByXMap).map(([x, y]) => ({ x: Number(x), y }));
            lowestY = Math.max(...Object.values(lowestPointsByXMap));
        }

        const clampedDeltaY = Math.min(this.height - 1, lowestY + expectedDropDeltaY) - lowestY;
        let shiftY = 1;

        for (; shiftY <= clampedDeltaY; shiftY++) {
            // Break if non-air material is found below any point of the bottom line       
            if (bottomLinePoints.some(point => this._getCell({ y: point.y + shiftY, x: point.x }).type !== 'air')) {
                break;
            }
        }

        return shiftY - 1;
    }

    private _renderRegion(from: Point = { x: 0, y: 0 }, to: Point = { x: this.width, y: this.height }) {
        let exactFrom = this._normalizeCoordinates(from);
        let exactTo = this._normalizeCoordinates({ x: to.x - 1, y: to.y - 1 });
        this._renderer.clearRect(from, { width: to.x - from.x, height: to.y - from.y });
        for (let x = exactFrom.x; x <= exactTo.x; x++) {
            for (let y = exactFrom.y; y <= exactTo.y; y++) {
                this._renderPoint({ x, y });
            }
        }
    }

    private _renderPoint(point: Point): void {
        const cell = this._getCell(point);
        this._renderer.renderPoint(point, cell.color);
    }

    private _updatePoint(point: Point, material: Material) {
        this._setCell(point, material);
        const chunkCoords = this._getChunkForPoint(point);
        this._matrixUpdatedChunks[`${chunkCoords.x}.${chunkCoords.y}`] = chunkCoords;
    }

    render() {
        Object.values(this._matrixUpdatedChunks).forEach(point => {
            this._renderRegion(point, { x: point.x + PixelMatrix.CHUNK_SIZE, y: point.y + PixelMatrix.CHUNK_SIZE });
        });

        this._matrixUpdatedChunks = {};
    }

    addSparseSandSquare(point: Point, radius: number = 10) {
        const exactPoint = this._normalizeCoordinates(point);
        const top = clamp(exactPoint.y - radius, 0, this.height);
        const bottom = clamp(exactPoint.y + radius, 0, this.height);
        const left = clamp(exactPoint.x - radius, 0, this.width);
        const right = clamp(exactPoint.x + radius, 0, this.width);

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                if (Math.random() > 0.6 && this._getCell({ x, y, }).type === 'air') {
                    this._updatePoint({ x, y }, getSandMaterial());
                }
            }
        }
    }

    eraseSandSquare(point: Point, radius: number = 10) {
        const exactPoint = this._normalizeCoordinates(point);
        const top = clamp(exactPoint.y - radius, 0, this.height);
        const bottom = clamp(exactPoint.y + radius, 0, this.height);
        const left = clamp(exactPoint.x - radius, 0, this.width);
        const right = clamp(exactPoint.x + radius, 0, this.width);

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                if (this._getCell({ x, y, }).type === 'sand') {
                    this._updatePoint({ x, y }, AirMaterial);
                }
            }
        }
    }

    addDroppingObject(point: Point, droppingObject: DroppingObject) {
        this._droppingObjects[droppingObject.id] = droppingObject;
        droppingObject.sprite.getCollisionPointsArray().forEach(point => {
            if (this._withinBoundaries(point)) {
                this._updatePoint(point, getCollisionBoxMaterial(droppingObject.id));
            }
        });
    }

    updateSimulation() {
        const currentTime = Date.now();
        if (this._lastUpdateTimestamp) {
            const timeDelta = currentTime - this._lastUpdateTimestamp;

            let bannedPoints: Record<string, true> = {};

            for (let i = (this.height - 1) * this.width - 1; i >= 0; i--) {
                const cell = this._materialMatrix[i];

                if (cell.static || this._materialMatrix[i + this.width].type !== 'air' || bannedPoints[`${i}`]) {
                    continue;
                }

                const x = i % this.width;
                const y = i / this.width << 0;

                let speed = cell.speed;
                let points = [{ x, y }];
                let droppingObject = null;

                if (cell.droppingObjectId) {
                    droppingObject = this._droppingObjects[cell.droppingObjectId];
                    speed = droppingObject.speed;
                    points = droppingObject.sprite.getCollisionPointsArray().filter(point => this._withinBoundaries(point));
                }

                const expectedDeltaY = Math.floor(speed * timeDelta);
                const actualDeltaY = this._getAvailableDropDeltaYForPoints(points, expectedDeltaY, cell);

                if (actualDeltaY > 0) {
                    points.forEach((point) => {
                        this._updatePoint(point, AirMaterial);
                    });

                    points.forEach(({ x, y }) => {
                        this._updatePoint({ x, y: y + actualDeltaY }, cell);

                        if (points.length > 1) {
                            bannedPoints[`${y + actualDeltaY * this.width + x}`] = true;
                        }
                    });

                    if (droppingObject) {
                        droppingObject.sprite.move({ dy: actualDeltaY });
                    }
                }
            }
        }

        this._lastUpdateTimestamp = currentTime;
    }
}
