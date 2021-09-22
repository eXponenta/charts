import type { IDataPlugin } from "./IDataPlugin";
import type { PluggableProvider } from "../providers";
import type { IDataFetchResult, IObjectData } from "../Chart";
import { Range } from '../Range';

import generate from 'nice-ticks';

/**
 * Data plugin for generation a nice tics/labels
 */
export class FancyLabelsPlugin implements IDataPlugin {
    public readonly name: string = 'FancyLabelsPlugin';
    public readonly maxYTics: number = 10;
    public readonly maxXTics: number = 10;
    private context: PluggableProvider;

    init (context: PluggableProvider): boolean {
        this.context = context;
        return true;
    }

    processElements(result: IDataFetchResult<IObjectData>, source: IDataFetchResult<IObjectData>): IDataFetchResult<IObjectData> {
        const data: IObjectData = [];
        const  {
            fromX, fromY, toX, toY
        } = result.dataBounds;

        let maxRealY = -Infinity;
        let minRealY = Infinity;
        let maxRealX = -Infinity;
        let minRealX = Infinity;

        // compute bound of passed data, because previous transformer can change data size
        // and apply offsets
        for (let element of result.data) {
            if (element.index == void 0) {
                continue;
            }

            const real = source.data[element.index];

            maxRealY = Math.max(maxRealY, real.y);
            maxRealX = Math.max(maxRealX, real.x);

            minRealY = Math.min(minRealY, real.y);
            minRealX = Math.min(minRealX, real.x);
        }

        const xTicks = generate(minRealX, maxRealX, this.maxXTics);
        const yTicks = generate(minRealY, maxRealY, this.maxYTics);

        const xLen = xTicks.length;
        const yLen = yTicks.length;

        for (let i = 0; i < Math.max(xLen, yLen); i ++) {
            let x = i < xLen ? xTicks[i] : xTicks[xLen - 1];
            let y = i < yLen ? yTicks[i] : yTicks[yLen - 1];

            const labelX = i < xLen ? x.toFixed(0) : null;
            const labelY = i < yLen ? y.toFixed(0) : null;

            x = (x - minRealX) / (maxRealX - minRealX);
            y = (y - minRealY) / (maxRealY - minRealY);

            x = x * (toX - fromX) + fromX;
            y = y * (toY - fromY) + fromY;

            data.push({
                x,
                y,
                labelX,
                labelY
            });
        }

        result.data = data;

        return result;
    }
}
