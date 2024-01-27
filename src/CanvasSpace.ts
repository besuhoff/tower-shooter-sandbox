import { createCanvas } from './helpers/createCanvas';
import { Dimensions } from './types/Dimensions';
import { Point } from './types/Point';
import { CanvasPointRenderer } from './render/CanvasPointRenderer';
import { PixelMatrix } from './PixelMatrix';
import { Tank } from './objects/Tank';
import { Sprite } from './Sprite';


export class CanvasSpace {
    readonly width: number;
    readonly height: number;

    private _pixelMatrix: PixelMatrix;
    private _sprites: Sprite[] = [];
    private _spriteRenderContext: CanvasRenderingContext2D;

    constructor({ width, height }: Dimensions, container: HTMLElement) {
        const pointCanvas = createCanvas({ width, height }, 'game-canvas-point', container);
        const pointRenderer = new CanvasPointRenderer(pointCanvas);
        this._pixelMatrix = new PixelMatrix({ width, height }, pointRenderer);

        const spriteCanvas = createCanvas({ width, height }, 'game-canvas-sprite', container);
        this._spriteRenderContext = spriteCanvas.getContext('2d');

        this.width = width;
        this.height = height;

    }

    private _renderSprite(sprite: Sprite): void {
        const { dimensions, coords } = sprite.getImageCoordinates();
        this._spriteRenderContext.drawImage(
            sprite.image,
            coords.x,
            coords.y,
            dimensions.width,
            dimensions.height
        );
    }

    addSparseSandSquare(point: Point, radius?: number): void {
        return this._pixelMatrix.addSparseSandSquare(point, radius);
    }

    eraseSandSquare(point: Point, radius?: number): void {
        return this._pixelMatrix.eraseSandSquare(point, radius);
    }

    addTank(point: Point) {
        const tank = new Tank(point);
        this._pixelMatrix.addDroppingObject(point, tank);
        this._sprites.push(tank.sprite);
    }

    updateSimulation() {
        this._pixelMatrix.updateSimulation();
    }

    render() {
        this._pixelMatrix.render();
        this._spriteRenderContext.clearRect(0, 0, this.width, this.height);
        this._sprites.forEach(sprite => this._renderSprite(sprite));
    }
}
