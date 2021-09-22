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

	private _lastProcessedState = {
	    fromX: 0, toX: 0, fromY: 0, toY: 0
    };

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

		const {
		    fitYRange
        } = this.context.chart.options.style;

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
                y: fromY + (y - b.fromY) * sy,
            }
        };

        const state = {
            fromX: Infinity, toX: -Infinity,
            fromY: Infinity, toY: -Infinity
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

            state.fromY = Math.min(current.y, state.fromY);
            state.toY = Math.max(current.y, state.toY);

            state.fromX = Math.min(current.x, state.fromX);
            state.toX = Math.max(current.x, state.toX);

            output.push(
                current
            );
        }

		// rescale Y auto ranged
		for (const out of output) {
		    if (fitYRange) {
                out.y = (fromY + (out.y - state.fromY) * height / (state.toY - state.fromY));
            }

		    out.y = height - out.y;
        }

		if (fitYRange) {
		    const h = state.toY - state.fromY;

            state.fromY = fromY;
            state.toY = fromY + h;
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

		b.fromX = this._lastProcessedState.fromX
		b.fromY = this._lastProcessedState.fromY;
		b.toX = this._lastProcessedState.toX;
		b.toY = this._lastProcessedState.toY;

		return result;
	}
}
