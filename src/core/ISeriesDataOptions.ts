import { LINE_JOIN} from "@pixi/graphics";
import type { IRangeObject } from "./Range";
import type { CHART_TYPE } from "./CHART_TYPE";
import type { Series } from "./Series";

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

export interface IDataFetchResult<T> {
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

export const DEFAULT_LABELS_STYLE = {
	x: {
		position: LABEL_LOCATION.BOTTOM,
	},
	y: {
		position: LABEL_LOCATION.LEFT
	}
};
export const DEFAULT_STYLE: ISeriesStyle = {
	fill: 0x0,
	stroke: 0x0,
	thickness: 2,
	lineJoint: LINE_JOIN.BEVEL,
	labels: DEFAULT_LABELS_STYLE,
	clamp: true,
	fitYRange: false,
};

export interface ISeriesStyle {
	fill?: number | string | [number, number, number, number];
	stroke?: number | string | [number, number, number, number];
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

export interface ISeriesDataOptions {
	type: CHART_TYPE;
	name?: string;
	parent?: string | Series;
	labels?: ILabelData | ILabelDataProvider;
	data: IDataSetModel | IDataProvider | IData;
	style?: ISeriesStyle;
}

export interface IMultiSeriesDataOptions {
    type: CHART_TYPE;
    name?: string;
    parent?: string | Series;
    datasets: Array<IDataSetModel | IDataProvider | IData>;
    styles?: Array<ISeriesStyle>;
}
