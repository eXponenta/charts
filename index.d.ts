import { Container } from '@pixi/display';
import { DisplayObject } from '@pixi/display';
import { EventEmitter } from '@pixi/utils';
import { IDestroyOptions } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { Renderer } from '@pixi/core';

declare enum BACKEND_TYPE {
    NONE = "none",
    PIXI = "pixi"
}

declare class BaseDrawer {
    readonly chart: Chart;
    static readonly BACKEND_TYPE: BACKEND_TYPE;
    static readonly TARGET_TYPE: TARGET_TYPE;
    static readonly CHART_TYPE: CHART_TYPE;
    get backendType(): any;
    get targetType(): any;
    get chartType(): any;
    constructor(chart: Chart);
    update(): void;
    reset(): void;
    getParsedStyle(): IChartStyle;
}

declare class BasePIXIDrawer extends BaseDrawer {
    static readonly BACKEND_TYPE = BACKEND_TYPE.PIXI;
    readonly node: DisplayObject;
}

export declare class Chart extends Container {
    readonly options: IChartDataOptions;
    name: string;
    readonly range: Range_2;
    readonly chartDrawer: BasePIXIDrawer;
    readonly labelDrawer: BasePIXIDrawer;
    readonly gridDrawer: BasePIXIDrawer;
    readonly viewport: Rectangle;
    dataProvider: IDataProvider;
    labelProvider: ILabelDataProvider;
    constructor(options: IChartDataOptions);
    private onRangeChanged;
    protected parse(): void;
    setViewport(x: number, y: number, width: number, height: number): void;
    destroy(_options?: IDestroyOptions | boolean): void;
    private _emitUpdate;
}

export declare enum CHART_EVENTS {
    UPDATE = "chart:update",
    DESTROY = "chart:destroy",
    RESIZE = "chart:resize"
}

export declare enum CHART_TYPE {
    BAR = "bar",
    LINE = "line",
    FILL = "area"
}

export declare class ChartApp {
    readonly renderer: Renderer;
    readonly stage: Container;
    readonly size: {
        width: number;
        height: number;
    };
    constructor(canvasOrId: HTMLCanvasElement | string);
    private onDimensionUpdate;
    private onChartUpdate;
    addChart(chart: Chart, name?: string): Chart;
    removeChart(name: string): Chart;
    private _unbindEvents;
    private _bindEvents;
    draw(): void;
}

export declare type IArrayChainData = Array<[number, number]>;

export declare type IArrayData = ArrayLike<number>;

export declare interface IChartDataOptions {
    type: CHART_TYPE;
    labels?: ILabelData | ILabelDataProvider;
    data: IDataSetModel | IDataProvider | IData;
    style?: IChartStyle;
}

export declare interface IChartStyle {
    fill?: number | string | [number, number, number, number];
    stroke?: number | string | [number, number, number, number];
    thickness?: number;
    lineJoint?: string;
}

export declare type IData = IArrayData | IArrayChainData | IObjectData;

export declare interface IDataProvider extends IDataSetModel {
    fetch(from?: number, to?: number): IData;
}

export declare interface IDataSetModel {
    data?: IData;
}

export declare type ILabelData = Array<string | Date | number>;

export declare interface ILabelDataProvider {
    fetch(from?: number, to?: number): ILabelData;
}

export declare type IObjectData = Array<{
    x: number | Date | string;
    y: number;
}>;

declare interface IRangeObject {
    fromX?: number;
    fromY?: number;
    toX?: number;
    toY?: number;
}

declare class Observable<T> extends EventEmitter {
    static CHANGE_EVENT: string;
    protected _dirtyId: number;
    constructor(fields?: Array<string>);
    protected _broadcast(name?: string, oldValue?: any, newValue?: any): void;
    protected _suspended: boolean;
    protected _dirtyBeforeSuspend: number;
    set suspended(v: boolean);
    get suspended(): boolean;
    dirtyId(): number;
    protected wrap<T>(fields: Array<string>, target: any): Observable<T>;
}

declare class Range_2 extends Observable<IRangeObject> {
    private _fromX;
    private _toX;
    private _fromY;
    private _toY;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    constructor(data?: IRangeObject);
    set({ fromX, fromY, toX, toY }?: IRangeObject): void;
}

declare enum TARGET_TYPE {
    NONE = "none",
    CHART = "chart",
    LABELS = "labels",
    GRID = "grid"
}

export { }
