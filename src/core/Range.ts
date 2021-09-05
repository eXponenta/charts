import { Observable } from "./Observable";

export interface IRangeObject {
    fromX?: number;
    fromY?: number;
    toX?: number;
    toY?: number;
}

export class Range extends Observable<IRangeObject> {
    private _fromX: number;
    private _toX: number;
    private _fromY: number;
    private _toY: number;

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

    public set ({ fromX = this._fromX, fromY = this._fromY, toX = this._toX, toY = this._toY }: IRangeObject = {}) {
        this.suspended = true;

        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;

        this.suspended = false;
    }
}
