import type { IDataFetchResult } from "../Chart";
import type { PluggableProvider } from "../providers";
import type { IDataPlugin } from "./IDataPlugin";

/**
 * Data transform plugin, used for converting a input data space to Chart range values,
 */
export class DataTransformPlugin implements IDataPlugin {
	public readonly name = 'DataTransformPlugin';

	private context: PluggableProvider;

	public readonly reduceXRange = true;

	/**
	 * @implements IDataPlugin
	 * @inheritDoc
	 */
	init(context: PluggableProvider): boolean {
		this.context = context;

		return true;
	}

	/**
	 * @implements IDataPlugin
	 * @inheritDoc
	 */
	processElements(data: any[], source: IDataFetchResult<any>): any {
		const {
			fromX, fromY, width, height
		} = this.context.chart.range;

		const b = source.dataBounds;
		const dw = b.toX - b.fromX || 1;
		const dh = b.toY - b.fromY || 1;

		const sx = width / dw;
		const sy = height / dh;

		return data.map(dataEntry => ([
			fromX + dataEntry[0] * sx,
			height - (fromY + dataEntry[1] * sy) // flip
		]));
	}

	/**
	 * @implements IDataPlugin
	 * @inheritDoc
	 */
	processResult(result: IDataFetchResult<any>, _source: IDataFetchResult<any>): IDataFetchResult<any> {
		const {
			fromX, fromY, width, height
		} = this.context.chart.range;

		const b = result.dataBounds;

		b.fromX += fromX;
		b.fromY += fromY;
		b.toX = fromX + width;
		b.toY = fromY + height;

		return result;
	}
}
