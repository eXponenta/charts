import { hex2rgb, rgb2hex } from "@pixi/utils";
import { LINE_JOIN } from "@pixi/graphics";

import { Plot } from "../../../pixi-candles/src";
import { CHART_TYPE } from '../../core/CHART_TYPE';
import { BaseDrawer } from "../BaseDrawer";

import type { Series } from '../../core/Series';
import { IDataFetchResult, IObjectData } from "../../core/ISeriesDataOptions";

export class LineDrawer extends BaseDrawer {
    public readonly name = 'LineDrawer';
    public readonly node: Plot = new Plot(null);
    public lastDrawnFetch: IDataFetchResult<IObjectData>;
    public alwaysUpdate: boolean = false;

    public init(context: Series): boolean {
        super.init(context);
        this.alwaysUpdate = context.options.type === CHART_TYPE.AREA;

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
        force = force || this.alwaysUpdate;

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

        this.lastDrawnFetch = dataProvider.fetch();

        const {
            data,
            dataBounds
        } = this.lastDrawnFetch;

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
