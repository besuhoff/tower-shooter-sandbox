import { Dimensions } from "./Dimensions";
import { Point } from "./Point";
import { Renderer } from "./Renderer";

export interface PointRenderer extends Renderer {
  clearRect(point: Point, dimensions: Dimensions): void;
  renderPoint(point: Point, color?: string): void;
}
