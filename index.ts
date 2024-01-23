import { time } from 'console';
import { clamp } from 'lodash';

const CHUNK_SIZE = 20;

class CanvasSpace {
    private _matrix: SpaceMatrix;
    private _chunks: Record<string, Point> = {};
    private _width: number;
    private _height: number;
    private _renderContext: CanvasRenderingContext2D;
    private _lastUpdateTimestamp: number;

    constructor({ width, height }: Dimensions, canvas: HTMLCanvasElement) {
        this._renderContext = canvas.getContext('2d');

        if (!this._renderContext) {
            throw new Error('Could not render as the context is not ready');
            return;
        }

        this._width = width;
        this._height = height;

        this._matrix = new Array(height);

        for (let y = 0; y < height; y++) {
            this._matrix[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                this.setPoint({ x, y }, AirMaterial);
            }
        }
    }

    private _getCoordinates(point: Point): Point {
        const x = Math.floor(point.x);
        const y = Math.floor(point.y);

        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            throw new RangeError(`No such point {${x}, ${y}}`);
        }

        return { x, y };
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    private _renderRegion(from: Point = { x: 0, y: 0 }, to: Point = { x: this._width, y: this._height }) {
        let exactFrom = this._getCoordinates(from);
        let exactTo = this._getCoordinates({ x: to.x - 1, y: to.y - 1 });
        for (let x = exactFrom.x; x <= exactTo.x; x++) {
            for (let y = exactFrom.y; y <= exactTo.y; y++) {
                this.renderPoint({ x, y });
            }
        }
    }

    private _getChunkFromPoint(point: Point): Point {
        const exactPoint = this._getCoordinates(point);
        return { x: exactPoint.x - exactPoint.x % CHUNK_SIZE, y: exactPoint.y - exactPoint.y % CHUNK_SIZE };
    }

    render() {
        Object.values(this._chunks).forEach(point => {
            this._renderRegion(point, { x: point.x + CHUNK_SIZE, y: point.y + CHUNK_SIZE });
        });

        this._chunks = {};
    }

    setPoint(point: Point, type: Material) {
        const { x, y } = this._getCoordinates(point);
        this._matrix[y][x] = type;
        const chunkCoords = this._getChunkFromPoint({ x, y });
        this._chunks[`${chunkCoords.x}.${chunkCoords.y}`] = chunkCoords;
    }


    renderPoint(point: Point): void {
        const { x, y } = this._getCoordinates(point);
        const cell = this._matrix[y][x];
        this._renderContext.fillStyle = cell.color[Math.floor(Math.random() * cell.color.length)];
        this._renderContext.fillRect(x, y, 1, 1);
    }

    addRandomSquarePortion(point: Point, material: Material, radius: number = 10) {
        const exactPoint = this._getCoordinates(point);
        const top = clamp(exactPoint.y - radius, 0, this._height);
        const bottom = clamp(exactPoint.y + radius, 0, this._height);
        const left = clamp(exactPoint.x - radius, 0, this._width);
        const right = clamp(exactPoint.x + radius, 0, this._width);

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                if (Math.random() > 0.6) {
                    this.setPoint({ x, y }, material);
                }
            }
        }
    }

    updateSimulation() {
        const currentTime = Date.now();
        if (this._lastUpdateTimestamp) {
            const timeDelta = currentTime - this._lastUpdateTimestamp;

            for (let y = this._height - 1; y >= 0; y--) {
                for (let x = 0; x < this._width; x++) {
                    const cell = this._matrix[y][x];
                    if (cell !== AirMaterial) {
                        let deltaY = Math.floor(cell.speed * timeDelta);
                        let resultY = y + 1;
                        for (; resultY < this._height && resultY < y + deltaY && (resultY === y || this._matrix[resultY][x] === AirMaterial); resultY++);

                        if (resultY - 1 !== y) {
                            this.setPoint({ x, y }, AirMaterial);
                            this.setPoint({ x, y: resultY - 1 }, SandMaterial);
                        }
                    }
                }
            }
        }

        this._lastUpdateTimestamp = currentTime;
    }
}

enum MaterialType {
    Air,
    Sand,
}

type Material = {
    name: string;
    color: string[];
    speed: number;
    type: MaterialType;
}

const AirMaterial: Material = {
    name: 'air',
    color: ['#d0ebff'],
    type: MaterialType.Air,
    speed: 0,
}

const SandMaterial: Material = {
    name: 'sand',
    color: ['#c5c51b', '#b9b919', '#c1c021'],
    type: MaterialType.Sand,
    speed: 0.4,
}

type SpaceMatrix = Material[][];

type Dimensions = {
    width: number;
    height: number;
}

type Point = {
    x: number;
    y: number;
}

const initSpace = (dimensions: Dimensions, canvas: HTMLCanvasElement): CanvasSpace => {
    return new CanvasSpace(dimensions, canvas);
}

const createCanvas = ({ width, height }: Dimensions, id: string, container: HTMLElement = document.body): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', `${width}`);
    canvas.setAttribute('height', `${height}`);
    canvas.id = id;
    container.appendChild(canvas);

    return canvas;
}

const width = 800;
const height = 600;

const canvas = createCanvas({ width, height }, 'render-canvas', document.getElementById('game'));
const space = initSpace({ width, height }, canvas);
console.log(space);
space.render();

let generationInterval: ReturnType<typeof setInterval> = null;
let generationPoint: Point = null;

canvas.addEventListener('mousedown', (event) => {
    const { offsetX, offsetY } = event;
    generationPoint = { x: clamp(offsetX, 0, width - 1), y: clamp(offsetY, 0, height - 1) };
    generationInterval = setInterval(() => {
        space.addRandomSquarePortion(generationPoint, SandMaterial);
    }, 40);
});

document.addEventListener('mouseup', () => {
    clearInterval(generationInterval);
});

canvas.addEventListener('mousemove', (event) => {
    if (!generationInterval) {
        return;
    }

    const { offsetX, offsetY } = event;
    generationPoint = { x: clamp(offsetX, 0, width - 1), y: clamp(offsetY, 0, height - 1) };
});

let previousTime = Date.now();
let measurements: number[] = [];

const renderLoop = () => {
    const currentTime = Date.now();
    const fps = (1000 / (currentTime - previousTime));
    measurements = [fps, ...measurements.slice(0, 200)];

    document.getElementById('fps').innerText = (measurements.reduce((a, b) => a + b, 0) / measurements.length).toFixed(1);
    previousTime = currentTime;
    space.updateSimulation();
    space.render();
    requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);