import type { IDataPlugin } from "./IDataPlugin";
import type { PluggableProvider } from "../providers";
import type { IDataFetchResult, IObjectData } from "../Chart";
import type { IRangeObject } from '../Range';

import generate from 'nice-ticks';

/**
 * Data plugin for generation a nice tics/labels
 */
export class FancyLabelsPlugin implements IDataPlugin {
    public readonly name: string = 'FancyLabelsPlugin';
    public maxYTics: number = 10;
    public maxXTics: number = 10;
    private context: PluggableProvider;

    private static _instance: FancyLabelsPlugin;
    public static get instance() {
        if (!this._instance) {
            return this._instance = new FancyLabelsPlugin();
        }

        return this._instance;
    }

    init (context: PluggableProvider): boolean {
        this.context = context;
        return true;
    }

    processElements(result: IDataFetchResult<IObjectData> & {trimmedSourceBounds?: IRangeObject}, source: IDataFetchResult<IObjectData>): IDataFetchResult<IObjectData> {
        const data: IObjectData = [];
        const range = this.context.chart.range;
        const resultBounds = result.dataBounds;
        const sourceBounds = source.dataBounds;

        const minX = source.data[result.data[0].index].x;
        const maxX = source.data[result.data[result.data.length - 1].index].x;

        const minY = result.trimmedSourceBounds ? result.trimmedSourceBounds.fromY : sourceBounds.fromY;
        const maxY = result.trimmedSourceBounds ? result.trimmedSourceBounds.toY : sourceBounds.fromY;

        this.maxYTics = Math.min(Math.round(this.context.chart.limits.height / 50), 10);
        this.maxXTics = Math.min(Math.round(this.context.chart.limits.width / 50), 10);

        const xTicks = generate(minX, maxX, this.maxXTics);
        const yTicks = generate(minY, maxY, this.maxYTics);

        const xLen = xTicks.length;
        const yLen = yTicks.length;

        for (let i = 0; i < Math.max(xLen, yLen); i ++) {
            let x = i < xLen ? xTicks[i] : xTicks[xLen - 1];
            let y = i < yLen ? yTicks[i] : yTicks[yLen - 1];

            const labelX = i < xLen ? x.toFixed(0) : null;
            const labelY = i < yLen ? y.toFixed(0) : null;

            x = (x - minX) / (maxX - minX);
            y = (y - minY) / (maxY - minY);

            x = x * (resultBounds.toX - resultBounds.fromX) + resultBounds.fromX;
            y = y * (range.toY - range.fromY) + range.fromY;

            data.push({
                x: Math.round(x),
                y: Math.round(y),
                labelX,
                labelY
            });
        }

        result.data = data;

        return result;
    }
}
