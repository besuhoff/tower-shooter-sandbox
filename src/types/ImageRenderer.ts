import { SpriteImage } from "../objects/SpriteImage";
import { Point } from "./Point";
import { Renderer } from "./Renderer";

export interface ImageRenderer extends Renderer {
  renderImage(coords: Point, image: SpriteImage): void;
}
