import { Container } from '@pixi/display';
import { DisplayObject } from '@pixi/display';
import { EventEmitter } from '@pixi/utils';
import { IDestroyOptions } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { Renderer } from '@pixi/core';

export declare class ArrayChainDataProvider implements IDataProvider {
    data: IData;
    readonly label: boolean;
    constructor(data: IData, label?: boolean);
    protected _fetchValueInternal(index: number): any;
    fetch(from?: number, to?: number): IDataFetchResult<IArrayChainData>;
}

export declare class ArrayLikeDataProvider implements IDataProvider {
    data: IData;
    readonly label: boolean;
    step: number;
    constructor(data: IData, label?: boolean, step?: number);
    fetch(from?: number, to?: number): IDataFetchResult<IArrayChainData>;
}

export declare enum BACKEND_TYPE {
    NONE = "none",
    PIXI = "pixi"
}

export declare class BaseDrawer {
    readonly chart: Chart;
    static readonly BACKEND_TYPE: BACKEND_TYPE;
    static readonly TARGET_TYPE: TARGET_TYPE;
    static readonly CHART_TYPE: CHART_TYPE;
    get backendType(): any;
    get targetType(): any;
    get chartType(): any;
    constructor(chart: Chart);
    link(): void;
    unlink(): void;
    update(): void;
    reset(): void;
    getParsedStyle(): IChartStyle;
    fit(): void;
}

export declare class BasePIXIDrawer extends BaseDrawer {
    static readonly BACKEND_TYPE = BACKEND_TYPE.PIXI;
    readonly node: DisplayObject;
}

export declare class Chart extends Container {
    readonly options: IChartDataOptions;
    private static CHART_DRAWERS;
    name: string;
    readonly range: Range_2;
    readonly chartDrawer: BasePIXIDrawer;
    readonly labelDrawer: BasePIXIDrawer;
    readonly gridDrawer: BasePIXIDrawer;
    readonly viewport: Rectangle;
    dataProvider: TransformedProvider;
    labelProvider: TransformedProvider;
    private _lastMousePoint;
    constructor(options: IChartDataOptions);
    private onDrag;
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
    AREA = "area"
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

export declare interface IDataFetchResult<T> {
    data: T;
    fromX: number;
    toX: number;
    dataBounds: IRangeObject;
}

export declare interface IDataProvider extends IDataSetModel {
    fetch(from?: number, to?: number): IDataFetchResult<IArrayChainData>;
}

export declare interface IDataSetModel {
    data?: IData;
}

export declare type ILabelData = Array<string | Date | number>;

export declare interface ILabelDataProvider {
    fetch(from?: number, to?: number): IDataFetchResult<ILabelData>;
}

export declare type IObjectData = Array<{
    x: number | Date | string;
    y: number;
}>;

export declare interface IRangeObject {
    fromX?: number;
    fromY?: number;
    toX?: number;
    toY?: number;
}

export declare class ObjectDataProvider extends ArrayChainDataProvider {
    protected _fetchValueInternal(index: number): any;
}

export declare class Observable<T> extends EventEmitter {
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

export declare function parseStyle(style: IChartStyle): IChartStyle;

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
    get width(): number;
    get height(): number;
    set({ fromX, fromY, toX, toY }?: IRangeObject): void;
    scale(x: number, y: number): void;
    translate(x: number, y: number): void;
}
export { Range_2 as Range }

export declare enum TARGET_TYPE {
    NONE = "none",
    CHART = "chart",
    LABELS = "labels",
    GRID = "grid"
}

declare class TransformedProvider implements IDataProvider {
    sourceProvider: IDataProvider;
    readonly range: Range_2;
    private _updateId;
    constructor(sourceProvider: IDataProvider);
    private onChange;
    get updateId(): number;
    fetch(from?: number, to?: number): IDataFetchResult<IArrayChainData>;
}

export { }
