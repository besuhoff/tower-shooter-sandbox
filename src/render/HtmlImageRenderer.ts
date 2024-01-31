import { SpriteImage } from "../objects/SpriteImage";
import { ImageRenderer } from "../types/ImageRenderer";
import { Point } from "../types/Point";
import { v4 as uuidV4 } from "uuid";

export class HtmlImageRenderer implements ImageRenderer {
  private _container: HTMLDivElement;
  private _images: Record<string, { element: HTMLImageElement, timeout: ReturnType<typeof setTimeout> }> = {};

  constructor(container: HTMLDivElement) {
    this._container = container;
    // @ts-ignore
    window['htmlRenderer'] = this;
  }

  clear() {
    this._container.innerHTML = '';
    this._images = {};
  }

  renderImage({ x, y }: Point, image: SpriteImage): void {
    if (this._images[image.id]) {
      clearTimeout(this._images[image.id].timeout);
      this._container.removeChild(this._images[image.id].element);
    }

    const imageElement = new Image();
    imageElement.src = image.imageElement.src.replace('image/gif', 'image/gif;uuid=' + image.id);
    imageElement.style.cssText = `
      position: absolute;
      left: ${x + image.coords.x}px;
      top: ${y + image.coords.y}px;
      transform: 
        scale(${image.flippedHorizontally ? -1 : 1}, ${image.flippedVertically ? -1 : 1}) 
        translate(${image.rotationCenterCoords.x}px, ${image.rotationCenterCoords.y}px) 
        rotate(${image.rotation}deg) 
        translate(-${image.rotationCenterCoords.x}px, -${image.rotationCenterCoords.y}px)
    `;

    this._container.appendChild(imageElement);
    this._images[image.id] = { element: imageElement, timeout: null };

    setTimeout(() => {
      const url = imageElement.src;
      imageElement.src = '';
      imageElement.src = url;
    });

    if (image.animationDuration) {
      this._images[image.id].timeout = setTimeout(() => {
        this._container.removeChild(this._images[image.id].element);
        delete this._images[image.id];
      }, image.animationDuration);
    }

  }
}
