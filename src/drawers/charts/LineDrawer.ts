import { hex2rgb, rgb2hex } from "@pixi/utils";
import { LINE_JOIN } from "@pixi/graphics";

import { Plot } from "../../../pixi-candles/src";
import { CHART_TYPE } from '../../core/CHART_TYPE';
import { BaseDrawer } from "../BaseDrawer";

import type { Series } from '../../core/Series';
import {IArrayChainData, IDataFetchResult, IObjectData} from "../../core/ISeriesDataOptions";

export class LineDrawer extends BaseDrawer {
    public readonly name = 'LineDrawer';
    public readonly node: Plot = new Plot(null);
    public lastDrawedFetch: IDataFetchResult<IObjectData>;

    public init(context: Series): boolean {
        super.init(context);

        return (
            context.options.type === CHART_TYPE.AREA ||
            context.options.type === CHART_TYPE.LINE
        );
    }

    /**
     *
     * @param force - Update any case, no check a alpha === 0
     */
    public update(force = false): boolean {
        const node = this.node;
        const {
            height
        } = this.context.range;

        const {
            dataProvider,
        } = this.context;

        const style = this.getParsedStyle();

        if (!force && (<number[]>style.stroke)[3] === 0) {
            node.alpha = 0;
            return;
        }

        node.clear();

        this.lastDrawedFetch = dataProvider.fetch();

        const {
            data,
            dataBounds
        } = this.lastDrawedFetch;

        node.lineStyle(style.thickness || 2, void 0, style.lineJoint as LINE_JOIN);

        node.tint = rgb2hex(style.stroke as number[]);
        node.alpha = (<number[]> style.stroke)[3];

        hex2rgb(0xffffff, node.shader.uniforms.uGeomColor);

        for (let i = 0; i < data.length; i ++) {
            const x = data[i].x;
            const y = height - data[i].y;

            if (i === 0) {
                node.moveTo(x, y);
            } else {
                node.lineTo(x, y);
            }
        }

        super.update()
        return true;
    }

    reset() {
        this.node.clear();
    }

    fit() {

    }
}
