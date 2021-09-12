import { Point, Rectangle } from "@pixi/math";
import { LINE_JOIN } from "@pixi/graphics";
import { Container, IDestroyOptions } from "@pixi/display";

import { IRangeObject, Range } from "./Range";
import { Observable } from "./Observable";
import type { BasePIXIDrawer } from "../drawers/";
import { BaseDrawer } from "../drawers/";
import { CHART_EVENTS } from "./CHART_EVENTS";
import { CHART_TYPE } from "./CHART_TYPE";

import { ArrayChainDataProvider, ArrayLikeDataProvider, ObjectDataProvider } from "./providers";
import { AreaDrawer} from "../drawers/charts/AreaDrawer";
import { LineDrawer} from "../drawers/charts";
import { TransformedProvider} from "./providers/TransformedProvider";
import { InteractionEvent} from "@pixi/interaction";

export type ILabelData = Array<string | Date | number>;
export type IArrayData = ArrayLike<number>;
export type IArrayChainData = Array<[number, number]>;
export type IObjectData = Array<{ x: number | Date | string, y: number }>

export interface IDataFetchResult <T> {
    data: T;
    fromX: number,
    toX: number,
    dataBounds: IRangeObject
}

export type IData = IArrayData | IArrayChainData | IObjectData;

export interface IDataSetModel {
    data?: IData;
}

export interface ILabelDataProvider {
    fetch(from?: number, to?: number): IDataFetchResult<ILabelData>;
}

export interface IDataProvider extends IDataSetModel {
    fetch(from?: number, to?: number): IDataFetchResult<IArrayChainData>;
}

const DEFAULT_STYLE: IChartStyle = {
    fill: 0x0,
    stroke: 0x0,
    thickness: 2,
    lineJoint: LINE_JOIN.BEVEL
};

export interface IChartStyle {
    fill?: number | string | [number, number, number, number];
    stroke?: number  | string | [number, number, number, number];
    thickness?: number,
    lineJoint?: string;
}

export interface IChartDataOptions {
    type: CHART_TYPE;
    labels?: ILabelData | ILabelDataProvider;
    data: IDataSetModel | IDataProvider | IData;
    style?: IChartStyle;
}

function isValidEnum(prop: string, enumType: Record<string, any>): boolean {
    if (!prop) {
        return false;
    }

    return Object.values<string>(enumType).includes(prop);
}

function validate(options: IChartDataOptions): IChartDataOptions {
    const result = {...options};

    if (!options.data) {
        throw  new Error('[Validate] Chart data must be presented!');
    }

    result.style =  {...DEFAULT_STYLE, ...(options.style) || {}};

    // validate type
    result.type = isValidEnum(options.type, CHART_TYPE) ? options.type : CHART_TYPE.LINE;

    // validate joints
    const joint = result.style.lineJoint;
    result.style.lineJoint = isValidEnum(joint, LINE_JOIN) ? joint : LINE_JOIN.BEVEL;

    return result;
}

export class Chart extends Container {
    private static CHART_DRAWERS: Record<CHART_TYPE, typeof BaseDrawer> = {
        [CHART_TYPE.LINE]: LineDrawer,
        [CHART_TYPE.BAR]: null,
        [CHART_TYPE.AREA]: AreaDrawer,
    }

    public name: string = '';
    public readonly chartDrawer: BasePIXIDrawer;
    public readonly labelDrawer: BasePIXIDrawer;
    public readonly gridDrawer: BasePIXIDrawer;
    public readonly viewport: Rectangle = new Rectangle();

    public readonly range: Range = new Range();
    public readonly limits: Range = new Range();


    public dataProvider: TransformedProvider;
    public labelProvider: TransformedProvider;

    private _lastPressedMousePoint: Point;
    private _lastMousePoint: Point;

    private _rangeScale: Point = new Point(1, 1);
    private _rangeTranslate: Point = new Point(0,0);

    constructor (
        public readonly options: IChartDataOptions
    ) {
        super();

        this.options = validate(options);

        this.onRangeChanged = this.onRangeChanged.bind(this);

        this.range.on(Observable.CHANGE_EVENT, this.onRangeChanged);

        const DrawerCtor = Chart.CHART_DRAWERS[this.options.type];

        if (!DrawerCtor) {
            throw new Error('Unsupported chart type: ' + this.options.type);
        }

        this.chartDrawer = <BasePIXIDrawer>(new DrawerCtor(this)); //new LineDrawer(this);

        const drawers = [
            this.gridDrawer, this.chartDrawer, this.labelDrawer
        ].filter(Boolean).map(e => e.node);

        this.addChild(...drawers);

        this.parse();

        this.interactive = true;
        this.interactiveChildren = false;

        this.on('mousemove', this.onDrag);
        document.addEventListener('wheel', this.onWheel.bind(this));

    }

    private transformRange() {
        this.range.suspended = true;
        this.range.set(this.limits);
        this.range.scale(this._rangeScale.x, this._rangeScale.y);
        this.range.translate(this._rangeTranslate.x, this._rangeTranslate.y);
        this.range.suspended = false;
    }

    private onWheel(event: WheelEvent): void {
        const scaleX = event.deltaY > 0 ? 1.1 : 0.9;
        const scaleY = 1;

        const pos = this._lastMousePoint;

        const dx = this._rangeTranslate.x - pos.x;
        const dy = this._rangeTranslate.y - pos.y;

        this._rangeTranslate.x -= (1 - scaleX) * dx;
        this._rangeTranslate.y -= (1 - scaleY) * dy;

        this._rangeScale.x *= scaleX;
        this._rangeScale.y *= scaleY;

        this.transformRange();

    }

    private onDrag(event: InteractionEvent): void {
        const original = event.data.originalEvent as MouseEvent;
        this._lastMousePoint = event.data.global.clone();

        if (original.buttons & 0x1) {

            if (this._lastPressedMousePoint) {
                this._rangeTranslate.x += event.data.global.x - this._lastPressedMousePoint.x;
                this._rangeTranslate.y -= event.data.global.y - this._lastPressedMousePoint.y;

                this.transformRange();
                this._emitUpdate();
            }

            this._lastPressedMousePoint = event.data.global.clone();
        } else {
            this._lastPressedMousePoint = null;
        }
    }

    private onRangeChanged (_field: string, _old: any, _newValue: any): void {
        this._emitUpdate();
    }

    protected parse() {
        const data = this.options.data;
        const labels = this.options.labels;

        let dataProvider: IDataProvider;
        let labelProvider: ILabelDataProvider;

        let primitiveData: IData;

        // parse data source
        if ('data' in data) {
            if ('fetch' in data) {
                dataProvider = data;
                labelProvider = labels as any;
            } else {
                primitiveData = data.data;
            }
        } else {
            primitiveData = data as IData;
        }

        if (!dataProvider) {
            const firstEntry = primitiveData[0];

            // array like
            if (Array.isArray(firstEntry) && firstEntry.length === 2) {
                dataProvider = new ArrayChainDataProvider(primitiveData, false);
                labelProvider = new ArrayChainDataProvider(primitiveData, true) as any;

            } else if (typeof firstEntry === 'object' && ('x' in <any>firstEntry) && ('y' in <any>firstEntry)) {
                // object like

                dataProvider = new ObjectDataProvider(primitiveData, false);
                labelProvider = new ObjectDataProvider(primitiveData, true) as any;
            } else {

                // is array
                dataProvider = new ArrayLikeDataProvider(primitiveData);

                // TODO Generate a labels when it not present
                labelProvider = new ArrayLikeDataProvider(labels as IArrayData, true) as any;
            }
        }

        this.dataProvider = new TransformedProvider(dataProvider, this.range);
        this.labelProvider =new TransformedProvider(labelProvider as any, this.range) as any;

        this._emitUpdate();
    }

    public setViewport (x: number, y: number, width: number, height: number): void {
        this.viewport.x = x;
        this.viewport.y = y;
        this.viewport.width = width;
        this.viewport.height = height;
        this.hitArea = this.viewport;

        this.limits.set({
            fromX: x, fromY: y, toX: x + width, toY: y + height
        });

        this.transformRange();

        this.emit(CHART_EVENTS.RESIZE, this);
        this._emitUpdate();
    }

    public destroy(_options?: IDestroyOptions | boolean): void {
        this.emit(CHART_EVENTS.DESTROY, this);

        super.destroy(_options);
    }

    private _emitUpdate(): void {
        this.emit(CHART_EVENTS.UPDATE, this);
    }
}
