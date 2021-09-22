import type {IDataFetchResult, IObjectData} from "../Chart";
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
	processElements(result: IDataFetchResult<IObjectData>, source: IDataFetchResult<IObjectData>): IDataFetchResult<IObjectData> {
		const {
			fromX, fromY, width, height
		} = this.context.chart.range;

		const {
		    fitYRange
        } = this.context.chart.options.style;

		const data = result.data;

		let {
		    fromX: limitLeft,
            toX: limitRight
        } = this.context.chart.limits;

		const b = result.dataBounds;
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

        if (fitYRange) {
            // rescale Y auto ranged
            for (const out of output) {
                out.y = (fromY + (out.y - state.fromY) * height / (state.toY - state.fromY));
            }
        }

		if (fitYRange) {
		    const h = state.toY - state.fromY;

            state.fromY = fromY;
            state.toY = fromY + h;
        }

		result.data = output;
		result.dataBounds = state;

		return result;
	}
}
