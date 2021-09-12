import { hex2rgb, rgb2hex } from "@pixi/utils";
import { LINE_JOIN } from "@pixi/graphics";

import { TARGET_TYPE } from "../../core/TARGET_TYPE";
import { CHART_TYPE } from "../../core/CHART_TYPE";

import { BasePIXIDrawer } from "../BasePIXIDrawer";
import { Plot } from "../../../pixi-candles/src";
import { IArrayChainData, IDataFetchResult } from "../../core";

export class LineDrawer extends BasePIXIDrawer {
    public static readonly CHART_TYPE = CHART_TYPE.LINE;
    public static readonly TARGET_TYPE = TARGET_TYPE.CHART;

    private _lastDirtyId = 0;
    private _dirtyId = -1;

    public readonly node: Plot = new Plot(null);
    public lastDrawedFetch: IDataFetchResult<IArrayChainData>;

    /**
     *
     * @param force - Update any case, no check a alpha === 0
     */
    public update(force = false) {
        const node = this.node;
        const {
            fromX, toX
        } = this.chart.range;

        const {
            dataProvider,
            viewport
        } = this.chart;

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

        const dataWidth = dataBounds.toX - dataBounds.fromX;
        const dataHeight = dataBounds.toY - dataBounds.fromY;

        node.lineStyle(style.thickness || 2, void 0, style.lineJoint as LINE_JOIN);

        node.tint = rgb2hex(style.stroke as number[]);
        node.alpha = (<number[]> style.stroke)[3];

        hex2rgb(0xffffff, node.shader.uniforms.uGeomColor);

        for (let i = 0; i < data.length; i ++) {
            const x = data[i][0];// * width / dataWidth;
            const y = dataHeight - data[i][1];// * height / dataHeight; // flip

            if (i === 0) {
                node.moveTo(x, y);
            } else {
                node.lineTo(x, y);
            }
        }

    }

    reset() {
        this.node.clear();
    }

    fit() {

    }
}
