import { Dimensions } from '../types/Dimensions';
import { Point } from '../types/Point';
import { PointRenderer } from '../types/PointRenderer';

export class CanvasPointRenderer implements PointRenderer {
    private _renderContext: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this._renderContext = canvas.getContext('2d');
        if (!this._renderContext) {
            throw new Error('Could not render as the context is not ready');
            return;
        }
    }

    renderPoint({ x, y }: Point, color?: string): void {
        if (!color) {
            return;
        }
        this._renderContext.fillStyle = color;
        this._renderContext.fillRect(x, y, 1, 1);
    }

    clearRect({ x, y }: Point, { width, height }: Dimensions): void {
        this._renderContext.clearRect(x, y, width, height);
    }
}
