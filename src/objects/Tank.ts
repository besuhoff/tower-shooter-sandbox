import { v4 as uuidV4 } from "uuid";
import { Point } from "../types/Point";
import { DroppingObject } from "../types/DroppingObject";
import { Direction } from "../types/Direction";
import { Sprite } from "./Sprite";
import TankRedImage from "../assets/tank_red.png";
import TankOrangeImage from "../assets/tank_orange.png";
import TankBrownImage from "../assets/tank_brown.png";
import TankYellowImage from "../assets/tank_yellow.png";
import TankGreenImage from "../assets/tank_green.png";
import TankTorquoiseImage from "../assets/tank_torquoise.png";
import TankBlueImage from "../assets/tank_blue.png";
import TankPurpleImage from "../assets/tank_purple.png";
import TankPinkImage from "../assets/tank_pink.png";
import TankGrayImage from "../assets/tank_gray.png";
import TankBlackImage from "../assets/tank_black.png";
import TrunkRedImage from "../assets/trunk_red.png";
import TrunkOrangeImage from "../assets/trunk_orange.png";
import TrunkBrownImage from "../assets/trunk_brown.png";
import TrunkYellowImage from "../assets/trunk_yellow.png";
import TrunkGreenImage from "../assets/trunk_green.png";
import TrunkTorquoiseImage from "../assets/trunk_torquoise.png";
import TrunkBlueImage from "../assets/trunk_blue.png";
import TrunkPurpleImage from "../assets/trunk_purple.png";
import TrunkPinkImage from "../assets/trunk_pink.png";
import TrunkGrayImage from "../assets/trunk_gray.png";
import TrunkBlackImage from "../assets/trunk_black.png";
import BlastAnimation from "../assets/bomb.gif";
import { SpriteImage } from "./SpriteImage";
import { Color } from "../types/Color";
import { FlipDirections } from "../types/FlipDirections";

const ANGLE_RANGES = [
  [-10, 80],
  [100, 190],
];
const TANK_SPRITE_ID = "tank";
const TRUNK_SPRITE_ID = "trunk";
const BLAST_SPRITE_ID = "blast";
const TRUNK_X_LEFT = -10;
const TRUNK_X_RIGHT = -8;
const IMAGE_BY_COLOR_MAP: Record<Color, { tank: string; trunk: string }> = {
  [Color.Red]: { tank: TankRedImage, trunk: TrunkRedImage },
  [Color.Orange]: { tank: TankOrangeImage, trunk: TrunkOrangeImage },
  [Color.Brown]: { tank: TankBrownImage, trunk: TrunkBrownImage },
  [Color.Yellow]: { tank: TankYellowImage, trunk: TrunkYellowImage },
  [Color.Green]: { tank: TankGreenImage, trunk: TrunkGreenImage },
  [Color.Torquoise]: { tank: TankTorquoiseImage, trunk: TrunkTorquoiseImage },
  [Color.Blue]: { tank: TankBlueImage, trunk: TrunkBlueImage },
  [Color.Purple]: { tank: TankPurpleImage, trunk: TrunkPurpleImage },
  [Color.Pink]: { tank: TankPinkImage, trunk: TrunkPinkImage },
  [Color.Gray]: { tank: TankGrayImage, trunk: TrunkGrayImage },
  [Color.Black]: { tank: TankBlackImage, trunk: TrunkBlackImage },
};

type TankOptions = {
  position: Point;
  direction?: Direction;
  color?: Color;
};

export class Tank implements DroppingObject {
  readonly sprite: Sprite;
  readonly speed = 1;
  readonly id = uuidV4();
  private _tankDirection: Direction = Direction.Right;

  constructor({
    position,
    direction = Direction.Right,
    color = Color.Green,
  }: TankOptions) {
    const tankImage = new SpriteImage(
      TANK_SPRITE_ID,
      IMAGE_BY_COLOR_MAP[color].tank,
      { x: -11, y: -14 },
      {
        flipped:
          direction === Direction.Left
            ? FlipDirections.None
            : FlipDirections.Horizontal,
      }
    );

    this._tankDirection = direction;

    const trunkImage = new SpriteImage(
      TRUNK_SPRITE_ID,
      IMAGE_BY_COLOR_MAP[color].trunk,
      {
        x: direction === Direction.Left ? TRUNK_X_LEFT : TRUNK_X_RIGHT,
        y: -13,
      },
      {
        rotation: direction === Direction.Left ? 0 : 180,
        rotationCenterCoords: { x: 9, y: 2 },
      }
    );

    const blastImage = new SpriteImage(
      BLAST_SPRITE_ID,
      BlastAnimation,
      {
        x: direction === Direction.Left ? TRUNK_X_LEFT - 4 : TRUNK_X_RIGHT - 4,
        y: -15,
      },
      {
        rotation: direction === Direction.Left ? 0 : 180,
        rotationCenterCoords: { x: 9, y: 2 },
      }
    );

    const collisionCoords: Point = {
      x: direction === Direction.Left ? -8 : -9,
      y: -8,
    };

    this.sprite = new Sprite(position, [tankImage, trunkImage], [blastImage], {
      leftTopCoords: collisionCoords,
      dimensions: {
        width: 17,
        height: 8,
      },
    });
  }

  rotateTrunk(rotationDirection: Direction) {
    const tankSpriteImage = this.sprite.getImageById(TANK_SPRITE_ID);
    const trunkSpriteImage = this.sprite.getImageById(TRUNK_SPRITE_ID);

    const addition = rotationDirection === Direction.Left ? -1 : 1;
    let newTankDirection = this._tankDirection;

    let newRotation = trunkSpriteImage.rotation + addition;
    if (newRotation < ANGLE_RANGES[0][0]) {
      newRotation = ANGLE_RANGES[1][1];
      newTankDirection = Direction.Right;
    }

    if (newRotation > ANGLE_RANGES[1][1]) {
      newRotation = ANGLE_RANGES[0][0];
      newTankDirection = Direction.Left;
    }

    if (newRotation > ANGLE_RANGES[0][1] && newRotation < ANGLE_RANGES[1][0]) {
      newRotation =
        rotationDirection === Direction.Left
          ? ANGLE_RANGES[0][1]
          : ANGLE_RANGES[1][0];
      newTankDirection =
        newTankDirection === Direction.Left ? Direction.Right : Direction.Left;
    }

    trunkSpriteImage.rotate(newRotation);

    if (newTankDirection !== this._tankDirection) {
      this._tankDirection = newTankDirection;
      tankSpriteImage.flip(FlipDirections.Horizontal);
      trunkSpriteImage.coords.x =
        newTankDirection === Direction.Left ? TRUNK_X_LEFT : TRUNK_X_RIGHT;
    }
  }
}
