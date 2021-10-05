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
        this.ty = t.tx;

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

    invert(): this {
        const sx = this.sx;
        const sy = this.sy;

        this.sx = 1 / sx;
        this.sy = 1 / sy;
        this.tx = - sx * this.tx;
        this.ty = - sy * this.ty;

        this._change();

        return this;
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
