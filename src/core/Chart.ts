import { Matrix, Point, Rectangle } from "@pixi/math";
import { LINE_JOIN } from "@pixi/graphics";
import { Container, IDestroyOptions } from "@pixi/display";
import { InteractionEvent} from "@pixi/interaction";

import { IRangeObject, Range } from "./Range";
import { Observable } from "./Observable";
import { BaseDrawer } from "../drawers/";
import { CHART_EVENTS } from "./CHART_EVENTS";
import { CHART_TYPE } from "./CHART_TYPE";
import {
    ArrayChainDataProvider,
    ArrayLikeDataProvider,
    ObjectDataProvider,
    PluggableProvider
} from "./providers";

import { DataTransformPlugin } from "./plugins/DataTransformPlugin";
import { IDrawerPlugin } from "../drawers/IDrawerPlugin";
import { AreaDrawer, LineDrawer} from "../drawers/charts";
import { GridDrawer } from "../drawers/grid/GridDrawer";
import { LabelsDrawer } from "../drawers/labels/LabelsDrawer";
import { BaseInput } from "./Input";

export type ILabelData = Array<string | Date | number>;
export type IArrayData = ArrayLike<number>;
export type IArrayChainData = Array<[number, number]>;
export type IObjectData = Array<{
    x: number,
    y: number,
    index?: number,
    labelX?: number | string | Date,
    labelY?: number | string | Date
}>

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
    fetch(from?: number, to?: number): IDataFetchResult<IObjectData>;
}

export enum LABEL_LOCATION {
    NONE = 'none',
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right'
}

const DEFAUTL_LABELS_STYLE = {
    x: {
        position: LABEL_LOCATION.BOTTOM,
    },
    y: {
        position: LABEL_LOCATION.LEFT
    }
};

const DEFAULT_STYLE: IChartStyle = {
    fill: 0x0,
    stroke: 0x0,
    thickness: 2,
    lineJoint: LINE_JOIN.BEVEL,
    labels: DEFAUTL_LABELS_STYLE,
    clamp: true,
    fitYRange: false,
};

export interface IChartStyle {
    fill?: number | string | [number, number, number, number];
    stroke?: number  | string | [number, number, number, number];
    thickness?: number;
    lineJoint?: string;
    labels?: {
        y?: {
            position: LABEL_LOCATION;
        } | null,
        x?: {
            position: LABEL_LOCATION;
        } | null
    },
    clamp: boolean,
    fitYRange: boolean
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

    result.style.labels = {
        x: {...DEFAUTL_LABELS_STYLE.x }, y: {...DEFAUTL_LABELS_STYLE.y },
        ...(options.style.labels || {})
    };

    return result;
}

/**
 * Root chart class that used for drawing a any kind of charts
 */
export class Chart extends Container {
    protected static plugins: typeof BaseDrawer[] = [];

    /**
     * Plugin register API for attaching DrawerPlugins globally. This plugins will be used for each instance of Chart
     * @param plugin
     */
    public static registerPlugin (plugin: typeof BaseDrawer): boolean {
        if (typeof plugin !== 'function' || !('init' in plugin.prototype)) {
            console.warn('[Chart plugin register] Plugin should have a valid constructor and has init method');
            return false;
        }

        this.plugins.push(plugin);
        return true;
    }

    /**
     * Chart name
     */
    public name: string = '';

    /**
     * Input service that attached on current chart
     */
    public input: BaseInput | null;

    public readonly range: Range = new Range();
    public readonly limits: Range = new Range();

    public dataProvider: PluggableProvider;

    private _lastPressedMousePoint: Point;
    private _lastMousePoint: Point;

    private readonly _plugins: IDrawerPlugin[] = [];
    private readonly _activePlugins: IDrawerPlugin[] = [];

    private _updateId: number = -1;
    private _drawId: number = -1;

    public get updateId(): number {
        return this._updateId;
    }

    public get drawId(): number {
        return this._drawId;
    }

    /**
     * Instance a Chart with provided data, chart data should be immutable
     * Handle the drawers that will be used for current Chart instances.
     * @param { IChartDataOptions } options
     * @param { IDrawerPlugin[] } plugins Drawers object that can be used in current chart
     */
    constructor (
        public readonly options: IChartDataOptions,
        plugins: IDrawerPlugin[] = [],
    ) {
        super();

        this.onRangeChanged = this.onRangeChanged.bind(this);

        this.options = validate(options);
        this.range.on(Observable.CHANGE_EVENT, this.onRangeChanged);

        this.interactive = true;
        this.interactiveChildren = false;

        this.preparePlugins(plugins);

        this.on('mousemove', this.onDrag);
        document.addEventListener('wheel', this.onWheel.bind(this));

        // first init
        this.init();
    }

    protected preparePlugins (externalPlugins: IDrawerPlugin[]) {
        this._plugins.length = 0;

        const pluginName = new Set();

        for (const Ctor of Chart.plugins) {
            const instance = new Ctor();

            if (!instance.name || pluginName.has(instance.name)) {
                console.warn('[Chart plugin init] Plugin not has name or already registered with same name:' + instance.name);
                continue;
            }

            pluginName.add(instance.name);
            this._plugins.push(instance);
        }

        for (const external of externalPlugins) {
            if (!external.name || pluginName.has(external.name)) {
                console.warn('[Chart plugin init] External Plugin not has name or already registered with same name:' + external.name);
                continue;
            }

            this._plugins.push(external);
        }
    }

    protected init() {
        this.parse();

        this._activePlugins.length = 0;

        for (const plugin of this._plugins) {
            if (!plugin.init(this)) {
                continue;
            }

            this._activePlugins.push(plugin);

            if (plugin.node) {
                this.addChild(plugin.node);
            }
        }

        this.sortChildren();
    }

    public update(): boolean {
        if (this._updateId === 0) {
            return false;
        }

        for (const plugin of this._activePlugins) {
            if (plugin.update && plugin.update()) {
                this._drawId ++;
            }
        }

        this._updateId = 0;
        return true;
    }

    public draw(): boolean {
        if (this._drawId === 0) {
            return false;
        }

        for (const plugin of this._activePlugins) {
            plugin.draw && plugin.draw();
        }

        this._drawId = 0;

        return true;
    }

    public reset() {
        for (const plugin of this._activePlugins) {
            plugin.reset && plugin.reset();
        }

        // remove all childs
        this.removeChildren();
        this._activePlugins.length = 0;

        this._drawId = this._updateId = -1;
    }

    public destroy(_options?: IDestroyOptions | boolean): void {
        super.destroy(_options);

        this.reset();

        for (const plugin of this._plugins) {
            plugin.dispose && plugin.dispose();
        }

        this._plugins.length = 0;

        this.emit(CHART_EVENTS.DESTROY, this);
    }

    private scaleAtPoint (point: Point, sx: number, sy: number) {
        this.range.suspended = true;

        this.range.translate(-point.x, -point.y);
        this.range.scale(sx, sy);
        this.range.translate(point.x, point.y);

        if (this.options.style.clamp) {
            this.range.clampToMin(this.limits);
        }
        this.range.suspended = false;
    }

    private transformRange({
        tx = 0, ty = 0, sx = 1, sy = 1
    } = {}) {
        const {
            clamp
        } = this.options.style;

        this.range.suspended = true;

        this.range.translate(tx, ty, clamp ?  this.limits : null);
        this.range.scale(sx, sy, clamp ? this.limits : null);

        this.range.suspended = false;
    }

    private onWheel(event: WheelEvent): void {
        const scaleX = event.deltaY > 0 ? 1.1 : 0.9;
        const scaleY = 1;

        if (!this._lastMousePoint) {
            return;
        }

        this.scaleAtPoint(this._lastMousePoint, scaleX, scaleY);
    }

    private onDrag(event: InteractionEvent): void {
        const original = event.data.originalEvent as MouseEvent;
        this._lastMousePoint = event.data.global.clone();

        if (original.buttons & 0x1) {

            if (this._lastPressedMousePoint) {
                const tx = event.data.global.x - this._lastPressedMousePoint.x;
                const ty = -(event.data.global.y - this._lastPressedMousePoint.y);

                this.transformRange({
                    tx, ty
                });
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

        let primitiveData: IData;

        // parse data source
        if ('data' in data) {
            if ('fetch' in data) {
                dataProvider = data;
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
                dataProvider = new ArrayChainDataProvider(primitiveData);

            } else if (typeof firstEntry === 'object' && ('x' in <any>firstEntry) && ('y' in <any>firstEntry)) {
                // object like

                dataProvider = new ObjectDataProvider(primitiveData);
            } else {

                // is array
                dataProvider = new ArrayLikeDataProvider(primitiveData);
            }
        }

        this.dataProvider = new PluggableProvider(dataProvider, this);

        this._emitUpdate();
    }

    public setViewport (x: number, y: number, width: number, height: number): void {
        this.hitArea = new Rectangle(x, y, width, height);
        this.limits.set({
            fromX: x, fromY: y, toX: x + width, toY: y + height
        });

        this.range.clampToMin(this.limits);

        this.emit(CHART_EVENTS.RESIZE, this);
        this._emitUpdate();
    }

    public getDrawerPluginByName<T extends IDrawerPlugin> (name: string, activeOnly = false): T | null {
        return (activeOnly ? this._activePlugins : this._plugins).find(e => e.name === name) as T;
    }

    public getDrawerPluginByClass<T extends IDrawerPlugin> (classType: typeof BaseDrawer, activeOnly = false): T | null {
        return (activeOnly ? this._activePlugins : this._plugins).find(e => e.constructor === classType) as T;
    }

    private _emitUpdate(): void {
        this._updateId ++;
        this.emit(CHART_EVENTS.UPDATE, this);
    }
}

// Register Data plugins
PluggableProvider.registerPlugin(DataTransformPlugin);

// register a Chart drawer plugin
Chart.registerPlugin(GridDrawer);
Chart.registerPlugin(LineDrawer);
Chart.registerPlugin(AreaDrawer);
Chart.registerPlugin(LabelsDrawer);
