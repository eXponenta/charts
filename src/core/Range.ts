import { Observable } from "./Observable";
import {Matrix} from "@pixi/math";
import {Transform} from "./Transform";

export interface IRangeObject {
    fromX?: number;
    fromY?: number;
    toX?: number;
    toY?: number;
}

export interface IRangeTransform {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
}

export class Range extends Observable<IRangeObject> {
    private _fromX: number = 0;
    private _toX: number = 0;
    private _fromY: number = 0;
    private _toY: number = 0;

    public fromX: number;
    public fromY: number;
    public toX: number;
    public toY: number;

    constructor (data: IRangeObject = {}) {
        super([
            'fromX', 'fromY', 'toX', 'toY'
        ]);

        data && this.set(data);
    }

    public get width(): number {
        return this.toX - this.fromX;
    }

    public get height(): number {
        return this.toY - this.fromY;
    }

    public set ({ fromX = this._fromX, fromY = this._fromY, toX = this._toX, toY = this._toY }: IRangeObject = {}) {
        this.suspended = true;

        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;

        this.suspended = false;
    }

    /**
     * Scale current range
     * @param x
     * @param y
     * @param limit
     */
    public scale(x: number, y: number = x, limit: Range = null): void {
        const def = this.suspended;

        this.suspended = true;

        this.toX *= x;
        this.toY *= y;
        this.fromX *= x;
        this.fromY *= y;

        if (limit) {
            this.clampToMin(limit);
        }

        this.suspended = def;
    }

    /**
     * Translate current range
     * @param tx
     * @param ty
     * @param limit
     */
    public translate(tx: number, ty: number = 0, limit: Range = null): void {
        const def = this.suspended;

        this.suspended = true;

        const {
            _fromX, _fromY, _toX, _toY
        } = this;

        if (limit) {
            // looks to left and clamp min
            if (tx > 0) {
                this.fromX = Math.min(limit.fromX, this._fromX + tx);
                this.toX = this.fromX + (_toX - _fromX);
            // looks to right and clamp by max
            } else if (tx < 0) {
                this.toX = Math.max(this._toX + tx, limit.toX);
                this.fromX = this.toX - (_toX - _fromX);
            }

            // looks to left and clamp min
            if (ty > 0) {
                this.fromY = Math.min(limit.fromY, this._fromY + ty);
                this.toY = this.fromY + (_toY - _fromY);
                // looks to right and clamp by max
            } else if (ty < 0) {
                this.toY = Math.max(this._toY + ty, limit.toY);
                this.fromY = this.toY - (_toY - _fromY);
            }

        } else {
            this.fromX += tx;
            this.toX += tx;

            this.fromY += ty;
            this.toY += ty;
        }

        this.suspended = def;
    }

    /**
     * Compute transformation between this range and required
     */
    public decomposeFrom (source: IRangeObject, transform?: Transform, align = 'left'): Transform {
        const t = transform || new Transform();
        const sw = source.toX - source.fromX;
        const sh = source.toY - source.fromY;

        t.sx = (this.width / sw) || 1;
        t.sy = (this.height / sh) || 1;

        if (align === 'left') {
            t.tx = (this.fromX - source.fromX);
            t.ty = (this.fromY - source.fromY);
        } else {
            t.tx = -(this.toX - source.toX);
            t.ty = -(this.toY - source.toY);
        }

        return t;
    }

    public transform(transform: IRangeTransform, limit?: Range) {
        this.scale(transform.sx, transform.sy, limit);
        this.translate(transform.tx, transform.ty, limit);
    }

    /**
     * Clamp range by minimal allowed view. This means that range never bee less that limit
     * This change a height/width, for clamping a position only use
     * @see clampPosition
     * @param { Range } limit target range limit
     */
    public clampToMin (limit: Range): void {
        const def = this.suspended;

        this.suspended = true;

        const {
            _fromX, _fromY, _toX, _toY
        } = this;


        this.fromX = Math.min (limit.fromX, _fromX);
        this.fromY = Math.min (limit.fromY, _fromY);
        this.toX = Math.max(limit.toX, _toX);
        this.toY = Math.max(limit.toY, _toY);

        this.suspended = def;
    }
}
