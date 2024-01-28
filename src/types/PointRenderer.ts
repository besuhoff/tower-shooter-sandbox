import { Point } from "./Point";
import { Renderer } from "./Renderer";

export interface PointRenderer extends Renderer {
  renderPoint(point: Point, color?: string): void;
}
