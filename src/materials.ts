export type Material = {
    readonly type: 'air' | 'sand' | 'collisionBox';
    readonly static: boolean;
    readonly speed?: number;
    readonly color?: string;
    readonly droppingObjectId?: string;
};

export const AirMaterial: Material = {
    type: 'air',
    static: true,
    speed: 0,
};

export const getSandMaterial = (): Material => ({
    type: 'sand',
    static: false,
    speed: 0.4,
    color: ['#e5c51b', '#d9b919', '#e1c021'][Math.floor(Math.random() * 3)],
});

export const getCollisionBoxMaterial = (droppingObjectId: string = null): Material => ({
    type: 'collisionBox',
    static: false,
    speed: 0,
    color: '#000000',
    droppingObjectId,
});

