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
        /**
         * @todo
         * Do this more clear, atm we depend of data transformer trimmed output and fit options and this will invalid if there are another data processor
         * try to use a source data and results for computing valid ticks
         */
        const data: IObjectData = [];
        const fitY = this.context.chart.options.style.fitYRange;
        const limits = this.context.chart.limits;
        const resultBounds = result.dataBounds;
        const sourceBounds = source.dataBounds;

        // fitY? What will be when fitted result is shifted?
        const scaleX = fitY ? limits.width : resultBounds.toX - resultBounds.fromX;
        let scaleY = fitY ? limits.height : resultBounds.toY - resultBounds.fromY;

        let minX = result.trimmedSourceBounds.fromX;
        let maxX = result.trimmedSourceBounds.toX;
        let minY = result.trimmedSourceBounds.fromY;
        let maxY = result.trimmedSourceBounds.toY;

        this.maxYTics = Math.min(Math.round(limits.height / 50), 10);
        this.maxXTics = Math.min(Math.round(limits.width / 50), 10);

        const yScaleFactor = (maxY - minY) / scaleY;

        minY -= yScaleFactor * resultBounds.fromY;
        maxY += yScaleFactor * (limits.height - resultBounds.toY);

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

            x = x * scaleX + resultBounds.fromX;
            y = y * limits.height;// resultBounds.fromY;

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
