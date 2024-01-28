import { clamp } from "lodash";
import { Point } from "./types/Point";
import { CanvasSpace } from "./CanvasSpace";
import { Direction } from "./types/Direction";
import { Color } from "./types/Color";

import './styles/index.css';

const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 450;

const container = document.getElementById("game");
container.style.width = `${SCREEN_WIDTH}px`;
container.style.height = `${SCREEN_HEIGHT}px`;
const game = new CanvasSpace(
  { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  container
);

let generationInterval: ReturnType<typeof setInterval> = null;
let generationPoint: Point = null;

container.addEventListener("contextmenu", (event) => event.preventDefault());

container.addEventListener("mousedown", (event) => {
  const { offsetX, offsetY } = event;
  generationPoint = {
    x: clamp(offsetX, 0, SCREEN_WIDTH - 1),
    y: clamp(offsetY, 0, SCREEN_HEIGHT - 1),
  };
  const radius = Number(
    document.querySelector<HTMLInputElement>('[name="radius"]').value
  );
  generationInterval = setInterval(() => {
    if (event.button === 2) {
      game.eraseSandSquare(generationPoint, radius);
      return;
    }
    game.addSparseSandSquare(generationPoint, radius);
  }, 40);
});

document.addEventListener("mouseup", () => {
  clearInterval(generationInterval);
});

container.addEventListener("mousemove", (event) => {
  if (!generationInterval) {
    return;
  }

  const { offsetX, offsetY } = event;
  generationPoint = {
    x: clamp(offsetX, 0, SCREEN_WIDTH - 1),
    y: clamp(offsetY, 0, SCREEN_HEIGHT - 1),
  };
});

const colors = Object.values(Color);

document
  .querySelector<HTMLButtonElement>('[data-action="addTank"]')
  .addEventListener("click", function (event) {
    if (this.disabled) {
      return;
    }

    game.addTank({
      position: { y: 100, x: 50 + (game.width - 100) * (11 - colors.length) / 10 },
      color: colors.shift(),
    });

    if (!colors.length) {
      this.disabled = true;
    }
  });

document.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    const direction =
      event.key === "ArrowLeft" ? Direction.Left : Direction.Right;
    game.rotateTankTrunk(direction);
  }

  if (event.key === ' ') {
    game.shoot();
  }
});

let previousTime = Date.now();
let measurements: number[] = [];

const renderLoop = () => {
  const currentTime = Date.now();
  const fps = 1000 / (currentTime - previousTime);
  measurements = [fps, ...measurements.slice(0, 100)];

  document.getElementById("fps").innerText = (
    measurements.reduce((a, b) => a + b, 0) / measurements.length
  ).toFixed(1);
  previousTime = currentTime;
  game.updateSimulation();
  game.render();
  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
