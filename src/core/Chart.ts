import {Container, IDestroyOptions} from "@pixi/display";
import {Range} from "./Range";
import {Observable} from "./Observable";
import {ArrayChainDataProvider} from "./ArrayChainDataProvider";
import {ObjectDataProvider} from "./ObjectDataProvider";
import {ArrayLikeDataProvider} from "./ArrayLikeDataProvider";
import {LineGraphicsDrawer} from "../drawers/charts/LineGraphicsDrawer";
import {BasePIXIDrawer} from "../drawers/BasePIXIDrawer";
import {CHART_EVENTS} from "./CHART_EVENTS";
import {CHART_TYPE} from "./CHART_TYPE";
import {Rectangle} from "@pixi/math";
import {LINE_JOIN} from "@pixi/graphics";

export type ILabelData = Array<string | Date | number>;
export type IArrayData = ArrayLike<number>;
export type IArrayChainData = Array<[number, number]>;
export type IObjectData = Array<{ x: number | Date | string, y: number }>

export type IData = IArrayData | IArrayChainData | IObjectData;

export interface IDataSetModel {
    data?: IData;
}

export interface ILabelDataProvider {
    fetch(from?: number, to?: number): ILabelData;
}

export interface IDataProvider extends IDataSetModel {
    fetch(from?: number, to?: number): IData;
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

function validate(options: IChartDataOptions): IChartDataOptions {
    const result = {...options};

    if (!options.data) {
        throw  new Error('[Validate] Chart data must be presented!');
    }

    result.style =  {...DEFAULT_STYLE, ...(options.style) || {}};

    // validate joints
    const joint = result.style.lineJoint;
    result.style.lineJoint = joint && (result.style.lineJoint in LINE_JOIN)
            ? joint
            : LINE_JOIN.BEVEL;

    return result;
}

export class Chart extends Container {
    public name: string = '';
    public readonly range: Range = new Range();
    public readonly chartDrawer: BasePIXIDrawer;
    public readonly labelDrawer: BasePIXIDrawer;
    public readonly gridDrawer: BasePIXIDrawer;
    public readonly viewport: Rectangle = new Rectangle();

    public dataProvider: IDataProvider;
    public labelProvider: ILabelDataProvider;

    constructor (
        public readonly options: IChartDataOptions
    ) {
        super();

        this.options = validate(options);

        this.onRangeChanged = this.onRangeChanged.bind(this);

        this.range.on(Observable.CHANGE_EVENT, this.onRangeChanged);

        this.chartDrawer = new LineGraphicsDrawer(this);

        const drawers = [
            this.gridDrawer, this.chartDrawer, this.labelDrawer
        ].filter(Boolean).map(e => e.node);

        this.addChild(...drawers);

        this.parse();
    }

    private onRangeChanged (_field: string, _old: any, _newValue: any): void {
        this._emitUpdate();
    }

    protected parse() {
        const data = this.options.data;
        const labels = this.options.labels;

        let primitiveData: IData;

        // parse data source
        if ('data' in data) {
            if ('fetch' in data) {
                this.dataProvider = data;
                this.labelProvider = labels as ILabelDataProvider;
                return;
            } else {
                primitiveData = data.data;
            }
        } else {
            primitiveData = data as IData;
        }

        const firstEntry = primitiveData[0];

        // array like
        if (Array.isArray(firstEntry) && firstEntry.length === 2) {
            this.dataProvider = new ArrayChainDataProvider(primitiveData, false);
            this.labelProvider = new ArrayChainDataProvider(primitiveData, true);
            return;
        }

        // object like
        if (typeof firstEntry === 'object' && ('x' in <any>firstEntry) && ('y' in <any>firstEntry)) {
            this.dataProvider = new ObjectDataProvider(primitiveData, false);
            this.labelProvider = new ObjectDataProvider(primitiveData, true);
            return;
        }

        // is array

        this.dataProvider = new ArrayLikeDataProvider(primitiveData);
        // TODO
        // Generate a labels when it not present
        this.labelProvider = new ArrayLikeDataProvider(labels as IArrayData);

        this._emitUpdate();
    }

    public setViewport (x: number, y: number, width: number, height: number): void {
        this.viewport.x = x;
        this.viewport.y = y;
        this.viewport.width = width;
        this.viewport.height = height;

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
