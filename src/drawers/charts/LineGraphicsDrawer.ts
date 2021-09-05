import { hex2rgb, rgb2hex } from "@pixi/utils";
import { LINE_JOIN } from "@pixi/graphics";

import { TARGET_TYPE } from "../../core/TARGET_TYPE";
import { CHART_TYPE } from "../../core/CHART_TYPE";

import { BasePIXIDrawer } from "../BasePIXIDrawer";
import { Plot } from "../../../pixi-candles/src";

export class LineGraphicsDrawer extends BasePIXIDrawer {
    public static readonly CHART_TYPE = CHART_TYPE.LINE;
    public static readonly TARGET_TYPE = TARGET_TYPE.CHART;

    private _lastDirtyId = 0;
    private _dirtyId = -1;

    public readonly node: Plot = new Plot(null);

    public update() {
        const node = this.node;
        const {
            fromX, toX
        } = this.chart.range;

        const {
            dataProvider,
            viewport
        } = this.chart;

        const style = this.getParsedStyle();

        node.clear();

        const width = viewport.width;
        const height = viewport.height - 30;

        const data = dataProvider.fetch() as Array<number>;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const step = width / data.length;

        node.lineStyle(style.thickness || 2, void 0, style.lineJoint as LINE_JOIN);

        node.tint = rgb2hex(style.stroke as number[]);
        node.alpha = (<number[]> style.stroke)[3];

        hex2rgb(0xffffff, node.shader.uniforms.uGeomColor);

        for (let i = 0; i < data.length; i ++) {
            const x = step * i;
            const y = 10 + height - height * (data[i] - min) / (max - min);

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
}
