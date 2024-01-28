import { SpriteImage } from "../objects/SpriteImage";
import { ImageRenderer } from "../types/ImageRenderer";
import { Point } from "../types/Point";
import { CanvasRenderer } from "./CanvasRenderer";

export class CanvasImageRenderer
  extends CanvasRenderer
  implements ImageRenderer
{
  renderImage({ x, y }: Point, image: SpriteImage): void {
    this._renderContext.save();
    this._renderContext.filter = 'brightness(150%)';
    this._renderContext.translate(
      x + image.coords.x + image.rotationCenterCoords.x,
      y + image.coords.y + image.rotationCenterCoords.y
    );
    this._renderContext.rotate((Math.PI * image.rotation) / 180);
    const flipH = image.flippedHorizontally;
    const flipV = image.flippedVertically;

    const width = image.imageElement.width;
    const height = image.imageElement.height;
    let positionX = -image.rotationCenterCoords.x;
    let positionY = -image.rotationCenterCoords.y;

    if (image.flippedHorizontally || image.flippedVertically) {
      const scaleH = flipH ? -1 : 1; // Set horizontal scale to -1 if flip horizontal
      const scaleV = flipV ? -1 : 1; // Set verical scale to -1 if flip vertical
      if (flipH) {
        // Set x position to -100% if flip horizontal
        positionX = (width + positionX) * -1;
      }
      if (flipV) {
        // Set y position to -100% if flip vertical
        positionY = (height + positionY) * -1;
      }

      this._renderContext.scale(scaleH, scaleV);
    }
    this._renderContext.drawImage(
      image.imageElement,
      positionX,
      positionY,
      width,
      height
    );
    this._renderContext.restore();
  }
}
