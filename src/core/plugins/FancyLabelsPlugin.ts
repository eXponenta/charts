import type { IDataPlugin } from "./IDataPlugin";
import type { PluggableProvider } from "../providers";
import type { IRangeObject } from '../Range';

import generate from 'nice-ticks';
import {IDataFetchResult, IObjectData} from "../ISeriesDataOptions";
import {Transform} from "../Transform";

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

    processElements(result: IDataFetchResult<IObjectData> & {trimmedSourceBounds?: IRangeObject, transform: Transform}, source: IDataFetchResult<IObjectData>): IDataFetchResult<IObjectData> {
        /**
         * @todo
         * Do this more clear, atm we depend of data transformer trimmed output and fit options and this will invalid if there are another data processor
         * try to use a source data and results for computing valid ticks
         */
        const data: IObjectData = [];
        const chart = this.context.chart;
        const fitY = chart.options.style.fitYRange;
        const limits = chart.limits;
        const resultBounds = result.dataBounds;

        // fitY? What will be when fitted result is shifted?
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

            const out = result.transform.apply({x, y});

            data.push({
                x: Math.round(out.x),
                y: Math.round(out.y),
                labelX,
                labelY
            });
        }

        result.data = data;

        return result;
    }
}
