import {EventEmitter} from "@pixi/utils";

export interface ITransorm {
    tx: number;
    ty: number;
    sx: number;
    sy: number;
}

export class Transform extends EventEmitter implements  ITransorm {
    public static readonly CHANGE = 'CHANGE';

    tx: number = 0;
    ty: number = 0;
    sx: number = 1;
    sy: number = 1;

    apply(from: {x: number, y: number}, to: {x: number, y: number} = {...from}) {
        to.x = from.x * this.sx + this.tx;
        to.y = from.y * this.sy + this.ty;

        return to;
    }

    translate (tx = 0, ty = tx): this {
        this.tx += tx;
        this.ty += ty;

        this._change();

        return this;
    }

    set (t: ITransorm) {
        this.sx = t.sx;
        this.sy = t.sy;
        this.tx = t.tx;
        this.ty = t.ty;

        this._change();
    }

    scale (sx: number = 1, sy: number = 1): this {
        this.sx *= sx;
        this.sy *= sy;
        this.tx *= sx;
        this.ty *= sy;

        this._change();

        return this;
    }

    identity() {
        this.tx = this.sx = 0;
        this.sx = this.sy = 1;

        this._change();
    }

    invert(self = true): Transform {
        const sx = this.sx;
        const sy = this.sy;

        const target = self ? this : new Transform();
        target.sx = 1 / sx;
        target.sy = 1 / sy;
        target.tx = - sx * this.tx;
        target.ty = - sy * this.ty;

        target._change();

        return target;
    }

    mul(transform: Transform, self = true): Transform {
        const {
            tx, ty, sx, sy
        } = this;

        const target = self ? this : new Transform();

        target.sx = transform.sx * sx;
        target.sy = transform.sy * sy;
        target.tx = transform.tx * sx + tx;
        target.ty = transform.ty * sy + ty;

        this._change();

        return target;
    }

    private _change() {
        this.emit(Transform.CHANGE, this);
    }
}
