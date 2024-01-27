import { clamp } from 'lodash';
import { Point } from './types/Point';
import { CanvasSpace } from './CanvasSpace';

const width = 800;
const height = 600;

const container = document.getElementById('game');
container.style.width = `${width}px`;
container.style.height = `${height}px`;
const space = new CanvasSpace({ width, height }, container);

let generationInterval: ReturnType<typeof setInterval> = null;
let generationPoint: Point = null;

container.addEventListener('contextmenu', (event) => event.preventDefault());

container.addEventListener('mousedown', (event) => {
    const { offsetX, offsetY } = event;
    generationPoint = { x: clamp(offsetX, 0, width - 1), y: clamp(offsetY, 0, height - 1) };
    const radius = Number(document.querySelector<HTMLInputElement>('[name="radius"]').value);
    generationInterval = setInterval(() => {
        if (event.button === 2) {
            space.eraseSandSquare(generationPoint, radius);
            return;
        }
        space.addSparseSandSquare(generationPoint, radius);
    }, 40);
});

document.addEventListener('mouseup', () => {
    clearInterval(generationInterval);
});

container.addEventListener('mousemove', (event) => {
    if (!generationInterval) {
        return;
    }

    const { offsetX, offsetY } = event;
    generationPoint = { x: clamp(offsetX, 0, width - 1), y: clamp(offsetY, 0, height - 1) };
});

document.querySelector('[data-action="addTank"]').addEventListener('click', () => {
    space.addTank({ y: 100, x: Math.floor(Math.random() * space.width) })
});

let previousTime = Date.now();
let measurements: number[] = [];

const renderLoop = () => {
    const currentTime = Date.now();
    const fps = (1000 / (currentTime - previousTime));
    measurements = [fps, ...measurements.slice(0, 100)];

    document.getElementById('fps').innerText = (measurements.reduce((a, b) => a + b, 0) / measurements.length).toFixed(1);
    previousTime = currentTime;
    space.updateSimulation();
    space.render();
    requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
