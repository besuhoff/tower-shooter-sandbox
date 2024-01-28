import { Dimensions } from "./Dimensions";
import { Point } from "./Point";

export interface Renderer {
  clearRect(point: Point, dimensions: Dimensions): void;
  clear(): void;
}
