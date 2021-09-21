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

		let {
		    fromX: limitLeft,
            toX: limitRight
        } = this.context.chart.limits;

		const b = source.dataBounds;
		const dw = b.toX - b.fromX || 1;
		const dh = b.toY - b.fromY || 1;

		const sx = width / dw;
		const sy = height / dh;
		const output = [];

		const transform = ({ x, y, ...other } : {x: number, y: number}) => {
		    return {
		        ...other,
                x: fromX + (x - b.fromX) * sx,
                y: height - (fromY + (y - b.fromY) * sy), // flip
            }
        };

		for (let i = 0; i < data.length; i ++) {
		    const current = transform(data[i]);

            if (this.reduceXRange) {
                if (current.x < limitRight && (i + 1) < data.length) {
                    const next = transform(data[i + 1]);

                    if (next.x < limitLeft) {
                        continue;
                    }
                }

                if (current.x > limitRight && i > 0) {
                    const prev = transform(data[i - 1]);

                    if (prev.x > limitRight) {
                        continue;
                    }
                }
            }

            output.push(
                current
            );
        }

		return output;
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
