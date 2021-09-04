import { Graphics } from "@pixi/graphics";
import { BasePIXIDrawer } from "../BasePIXIDrawer";
import { CHART_TYPE } from "../../core/CHART_TYPE";
import { TARGET_TYPE } from "../../core/TARGET_TYPE";
import type { Chart } from "../../core/Chart";

export class LineGraphicsDrawer extends BasePIXIDrawer {
    public static readonly CHART_TYPE = CHART_TYPE.LINE;
    public static readonly TARGET_TYPE = TARGET_TYPE.CHART;

    private _lastDirtyId = 0;
    private _dirtyId = -1;

    public readonly node: Graphics = new Graphics();

    public update() {
        const node = this.node;
        const {
            fromX, toX
        } = this.chart.range;

        const {
            dataProvider
        } = this.chart;

        node.clear();

        const width = 300;
        const height = 200;

        const data = dataProvider.fetch() as Array<number>;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const step = width / data.length;

        node.lineStyle({
            width:2, color: 0xff0000
        });

        for (let i = 0; i < data.length; i ++) {
            const x = step * i;
            const y = height * (data[i] - min) / (max - min);

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
