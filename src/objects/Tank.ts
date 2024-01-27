import { v4 as uuidV4 } from 'uuid';
import { Point } from '../types/Point';
import { DroppingObject } from '../types/DroppingObject';
import { Direction } from '../types/Direction';
import { Sprite } from '../Sprite';

export class Tank implements DroppingObject {
    readonly sprite: Sprite;
    readonly speed = 1;
    readonly id = uuidV4();

    static IMAGE_LEFT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAYAAAArMezNAAAAAXNSR0IArs4c6QAAANJJREFUOE/Nkz0OwyAMhY2UDFkzdqvgDCy9Qu6Zk3SBA7CAeoOsGTKksltawp+KsjQTesD3jJ/DoO3bC8dZrCdCxWfvr32yvT02rx1Yv4IJ2l26rO96X1H/LzBWVOpvUm1WCN5aA9Uip5bEPT7AcmHViGGQHvwBxrBSYCWDd5BUcTJGrbDYBOEE9hvDbWj7XQqnPRg45/s4jqC1hrNwhHLOX+EhWEpJ/vM8n6p6miYwxnynIoRba0EIQQata6UUOOfYYdwQjjBsy7IsBG5dIxTvPQHqzlbcWDT7OAAAAABJRU5ErkJggg==';
    static IMAGE_RIGHT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAYAAAArMezNAAAAAXNSR0IArs4c6QAAAM9JREFUOE+9kz0OgzAMhZOBgTU3qMLCAcLSk+SeuUKXnCFWt46sDCBR2W0QPzYCVDWTeVjfc55BK/6Mgq4FfSNzjQQtbsWmuX/2qB2Cs+DyXrKDDa9BHYX/FYzTShlfimIPtrczNvMsigvbI37znrdMJlgQVFqYBMZFzs/KRBP4LHRtxpn8BJyNukc3eWpr7QgAp6NYT41Q55xq21YBgCZwXdcqhHD0b2X7vPekxxg/YHxAeNM09CKlpKqqulRn6OJjRzgKxhi6zpUaJ83XeQNOl2sNfVgX+gAAAABJRU5ErkJggg==';

    constructor(position: Point, direction: Direction = 'left') {
        const image = direction === 'left' ? Tank.IMAGE_LEFT : Tank.IMAGE_RIGHT;
        const collisionCoords: Point = {
            x: direction === 'left' ? -8 : -9,
            y: -8
        };
        const width = 22;
        const height = 14;
        this.sprite = new Sprite(position, image, {
            leftTopCoords: collisionCoords,
            dimensions: {
                width: 17,
                height: 8,
            }
        });
    }
}
