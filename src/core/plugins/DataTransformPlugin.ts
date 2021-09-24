import type {IDataFetchResult, IObjectData} from "../Chart";
import type { PluggableProvider } from "../providers";
import type { IDataPlugin } from "./IDataPlugin";
import { IRangeObject } from "../Range";

type DataTransformPluginResult = IDataFetchResult<IObjectData> & { trimmedSourceBounds?: IRangeObject };

class DataBounds implements IRangeObject {
    fromX = Infinity;
    toX = -Infinity;
    fromY = Infinity;
    toY = -Infinity;

    grown ({x, y} : {x: number, y: number}): void {
        if (x < this.fromX) this.fromX = x;
        if (x > this.toX) this.toX = x;

        if (y < this.fromY) this.fromY = y;
        if (y > this.toY) this.toY = y;
    }
}
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
	processElements(result: DataTransformPluginResult, source: IDataFetchResult<IObjectData>): DataTransformPluginResult {
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

        const outBounds = new DataBounds();
        const trimmedBounds = new DataBounds();

        for (let i = 0; i < data.length; i ++) {
            const input = data[i];
		    const current = transform(input);

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

            outBounds.grown(current);
            trimmedBounds.grown(input);

            output.push(
                current
            );
        }

        if (fitYRange) {
            // rescale Y auto ranged
            for (const out of output) {
                out.y = (fromY + (out.y - outBounds.fromY) * height / (outBounds.toY - outBounds.fromY));
            }

            outBounds.toY = fromY + (outBounds.toY - outBounds.fromY);
            outBounds.fromY = fromY;
        }


        result.data = output;

        result.dataBounds = outBounds;
		result.trimmedSourceBounds = trimmedBounds;

		return result;
	}
}
