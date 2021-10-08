import { Container } from '@pixi/display';
import { DisplayObject } from '@pixi/display';
import { EventEmitter } from '@pixi/utils';
import { IDestroyOptions } from '@pixi/display';
import { InteractionManager } from '@pixi/interaction';
import { Renderer } from '@pixi/core';
import { Ticker } from '@pixi/ticker';

export declare class ArrayChainDataProvider implements IDataProvider {
    data: IData;
    constructor(data: IData);
    protected _fetchValueInternal(index: number): IObjectData[0];
    fetch(from?: number, to?: number): IDataFetchResult<IObjectData>;
}

export declare class ArrayLikeDataProvider implements IDataProvider {
    data: IData;
    readonly label: boolean;
    step: number;
    constructor(data: IData, label?: boolean, step?: number);
    fetch(from?: number, to?: number): IDataFetchResult<IObjectData>;
}

export declare class BaseDrawer implements IDrawerPlugin {
    name: string;
    protected context: Series;
    init(context: Series): boolean;
    update(): boolean;
    draw(): void;
    reset(): void;
    dispose(): void;
    protected getParsedStyle(): ISeriesStyle;
}

declare abstract class BaseInput extends EventEmitter {
    abstract register(chart: Series): void;
    abstract unregister(chart: Series): void;
    abstract update(deltaTime: number): void;
}

export declare class Chart {
    readonly series: Set<Series>;
    readonly ticker: Ticker;
    readonly renderer: Renderer;
    readonly stage: Container;
    readonly size: {
        width: number;
        height: number;
    };
    readonly input: PixiInput;
    constructor(canvasOrId: HTMLCanvasElement | string);
    private timeout;
    private onResizeProcess;
    private onDimensionUpdateLazy;
    private onDimensionUpdate;
    private onSeriesUpdate;
    add(data: ISeriesDataOptions | ISeriesDataOptions[] | IMultiSeriesDataOptions | Series, nested?: boolean): this;
    getByName(name: string): Series | null;
    get tall(): Series | null;
    addSeries(series: Series, name?: string): Series;
    removeSeries(name: string): Series;
    private _unbindEvents;
    private _bindEvents;
    protected update(): void;
    protected draw(): void;
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

export declare class DataTransformPlugin implements IDataPlugin {
    readonly name = "DataTransformPlugin";
    private context;
    readonly reduceXRange = true;
    init(context: PluggableProvider): boolean;
    processElements(result: DataTransformPluginResult, source: IDataFetchResult<IObjectData>): DataTransformPluginResult;
}

declare type DataTransformPluginResult = IDataFetchResult<IObjectData> & {
    trimmedSourceBounds?: IRangeObject;
    transform?: Transform;
};

export declare const DEFAULT_LABELS_STYLE: {
    x: {
        position: LABEL_LOCATION;
    };
    y: {
        position: LABEL_LOCATION;
    };
};

export declare const DEFAULT_LABELS_STYLE_PARENT: {
    x: {
        position: LABEL_LOCATION;
    };
    y: {
        position: LABEL_LOCATION;
    };
};

export declare const DEFAULT_STYLE: ISeriesStyle;

export declare type IArrayChainData = Array<[number, number]>;

export declare type IArrayData = ArrayLike<number>;

export declare type IData = IArrayData | IArrayChainData | IObjectData;

export declare interface IDataFetchResult<T> {
    data: T;
    fromX: number;
    toX: number;
    dataBounds: IRangeObject;
}

export declare interface IDataPlugin {
    name: string;
    init?(context: PluggableProvider): boolean;
    processElements?(result: IDataFetchResult<IObjectData>, source: IDataFetchResult<IObjectData>): IDataFetchResult<IObjectData>;
}

export declare interface IDataProvider extends IDataSetModel {
    fetch(from?: number, to?: number): IDataFetchResult<IObjectData>;
}

export declare interface IDataSetModel {
    data?: IData;
}

export declare interface IDrawerPlugin {
    name: string;
    node?: DisplayObject;
    init(context: Series): boolean;
    update?(): boolean;
    draw?(): void;
    reset?(): void;
    dispose?(): void;
}

export declare type IFunctionDataPlugin = (result: IDataFetchResult<IObjectData>, source: IDataFetchResult<any>) => IDataFetchResult<IObjectData>;

export declare type ILabelData = Array<string | Date | number>;

export declare interface ILabelDataProvider {
    fetch(from?: number, to?: number): IDataFetchResult<ILabelData>;
}

export declare interface IMultiSeriesDataOptions {
    type: CHART_TYPE;
    name?: string;
    parent?: string | Series;
    datasets: Array<IDataSetModel | IDataProvider | IData>;
    styles?: Array<ISeriesStyle>;
}

export declare type IObjectData = Array<{
    x: number;
    y: number;
    index?: number;
    labelX?: number | string | Date;
    labelY?: number | string | Date;
}>;

export declare interface IRangeObject {
    fromX?: number;
    fromY?: number;
    toX?: number;
    toY?: number;
}

export declare interface IRangeTransform {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
}

export declare interface ISeriesDataOptions {
    type: CHART_TYPE;
    name?: string;
    parent?: string | Series;
    labels?: ILabelData | ILabelDataProvider;
    data: IDataSetModel | IDataProvider | IData;
    style?: ISeriesStyle;
}

export declare interface ISeriesStyle {
    fill?: number | string | [number, number, number, number];
    stroke?: number | string | [number, number, number, number];
    thickness?: number;
    lineJoint?: string;
    labels?: {
        y?: {
            position: LABEL_LOCATION;
        } | null;
        x?: {
            position: LABEL_LOCATION;
        } | null;
    };
    clamp: boolean;
    fitYRange: boolean;
}

declare interface ITransorm {
    tx: number;
    ty: number;
    sx: number;
    sy: number;
}

export declare enum LABEL_LOCATION {
    NONE = "none",
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right"
}

export declare class ObjectDataProvider extends ArrayChainDataProvider {
    protected _fetchValueInternal(index: number): IObjectData[0];
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

export declare function parseStyle(style: ISeriesStyle): ISeriesStyle;

declare class PixiInput extends BaseInput {
    readonly provider: InteractionManager;
    private _charts;
    private _eventsRegistered;
    constructor(provider: InteractionManager);
    private _attachEvents;
    private _onWheel;
    private _onPointerTap;
    private _onPointerMove;
    private _onPointerUp;
    private _onPointerDown;
    private _detachEvents;
    register(chart: Series): void;
    unregister(chart: Series): void;
    update(deltaTime: number): void;
}

export declare class PluggableProvider implements IDataProvider, IDataPlugin {
    sourceProvider: IDataProvider;
    chart: Series;
    readonly name = "PluggableProvider";
    private static readonly plugins;
    static registerPlugin(plugin: IDataPlugin): boolean;
    private readonly _plugins;
    private readonly _activePlugins;
    private _sessionPlugins;
    constructor(sourceProvider: IDataProvider, chart: Series, plugins?: IDataPlugin[]);
    use(...sessionPlugins: (IDataPlugin | IFunctionDataPlugin)[]): void;
    init(): boolean;
    processElements(result: IDataFetchResult<IObjectData>, source: IDataFetchResult<any>): IDataFetchResult<IObjectData>;
    fetch(from?: number, to?: number): IDataFetchResult<IObjectData>;
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
    get width(): number;
    get height(): number;
    set({ fromX, fromY, toX, toY }?: IRangeObject): void;
    scale(x: number, y?: number, limit?: Range_2): void;
    translate(tx: number, ty?: number, limit?: Range_2): void;
    decomposeFrom(source: IRangeObject, transform?: Transform, align?: string): Transform;
    transform(transform: IRangeTransform, limit?: Range_2): void;
    clampToMin(limit: Range_2): void;
}
export { Range_2 as Range }

export declare class Series extends EventEmitter {
    readonly options: ISeriesDataOptions;
    protected static plugins: typeof BaseDrawer[];
    static registerPlugin(plugin: typeof BaseDrawer): boolean;
    readonly node: Container;
    private readonly _plugins;
    private readonly _activePlugins;
    private readonly _range;
    private readonly _localTransform;
    private readonly _worldTransform;
    get transform(): Transform;
    limits: Range_2;
    name: string;
    input: BaseInput | null;
    context: Chart | null;
    parent: Series | null;
    dataProvider: PluggableProvider;
    get range(): Range_2;
    private _lastPressedMousePoint;
    private _lastMousePoint;
    private _updateId;
    private _drawId;
    get updateId(): number;
    get drawId(): number;
    constructor(options: ISeriesDataOptions, plugins?: IDrawerPlugin[]);
    bind(context: Chart, parent?: Series): void;
    unbind(context: Chart): void;
    protected preparePlugins(externalPlugins: IDrawerPlugin[]): void;
    protected init(): void;
    update(): boolean;
    draw(): boolean;
    reset(): void;
    destroy(_options?: IDestroyOptions | boolean): void;
    private scaleAtPoint;
    private transformRange;
    private onWheel;
    private onDrag;
    private onRangeChanged;
    protected parse(): void;
    setViewport(x: number, y: number, width: number, height: number): void;
    getDrawerPluginByName<T extends IDrawerPlugin>(name: string, activeOnly?: boolean): T | null;
    getDrawerPluginByClass<T extends IDrawerPlugin>(classType: typeof BaseDrawer, activeOnly?: boolean): T | null;
    private _emitUpdate;
}

declare class Transform extends EventEmitter implements ITransorm {
    static readonly CHANGE = "CHANGE";
    tx: number;
    ty: number;
    sx: number;
    sy: number;
    apply(from: {
        x: number;
        y: number;
    }, to?: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    translate(tx?: number, ty?: number): this;
    set(t: ITransorm): void;
    scale(sx?: number, sy?: number): this;
    identity(): void;
    invert(self?: boolean): Transform;
    mul(transform: Transform, self?: boolean): Transform;
    private _change;
}

export { }
