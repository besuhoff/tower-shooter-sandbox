import { Sprite } from "../objects/Sprite";

export interface DroppingObject {
  readonly sprite: Sprite;
  readonly speed: number;
  readonly id: string;
}
