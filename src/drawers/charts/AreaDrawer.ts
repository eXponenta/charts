import { Container } from "@pixi/display";
import { rgb2hex } from "@pixi/utils";
import { PlotGradient } from "../../../pixi-candles/src";

import { BasePIXIDrawer } from "../BasePIXIDrawer";
import type { Chart } from "../../core";
import { TARGET_TYPE, CHART_TYPE } from "../../core";
import { LineDrawer } from "./LineDrawer";

export class AreaDrawer extends BasePIXIDrawer {
    public static readonly TARGET_TYPE: TARGET_TYPE = TARGET_TYPE.CHART;
    public static readonly CHART_TYPE: CHART_TYPE = CHART_TYPE.AREA;

    public readonly node = new Container();
    private readonly _areaNode: PlotGradient;
    private readonly _lineDrawer: LineDrawer;

    constructor(chart: Chart) {
        super(chart);

        this._lineDrawer = new LineDrawer(chart);
        // update will trigger from this
        this._lineDrawer.unlink();
        this._areaNode = new PlotGradient();
        this._areaNode.masterPlot = this._lineDrawer.node;

        this.node.addChild(
            this._areaNode,
            this._lineDrawer.node
        );
    }

    public update() {
        const style = this.getParsedStyle();
        const area = this._areaNode;

        this._lineDrawer.update(true);

        const fillColor = rgb2hex(style.fill as number[]);
        const fillAlpha = (<number[]> style.fill)[3];

        area.colorTop = area.colorBottom = fillColor;
        area.alphaTop = fillAlpha;
        area.alphaBottom = fillAlpha * 0.5;

        area.coordTop = 0;

        const viewport = this.chart.viewport;
        const dataBounds = this._lineDrawer.lastDrawedFetch.dataBounds;

        area.coordBottom = Math.max(viewport.height - dataBounds.fromY, viewport.height);

        area.tint = 0x1571D6;
    }
}
