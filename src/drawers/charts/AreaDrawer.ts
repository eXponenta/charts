import { Container } from "@pixi/display";
import { rgb2hex } from "@pixi/utils";
import { PlotGradient } from "../../../pixi-candles/src";

import { LineDrawer } from "./LineDrawer";
import { BaseDrawer } from "../BaseDrawer";
import { CHART_TYPE } from "../../core/CHART_TYPE";
import type { Series } from "../../core/Series";

export class AreaDrawer extends BaseDrawer {
    public readonly name = 'AreaDrawer';
    public readonly node = new Container();
    private _areaNode: PlotGradient;
    private _lineDrawer: LineDrawer;
    private _localDrawer: boolean = false;

    constructor() {
        super();
    }

    init (context: Series): boolean {
        super.init(context);

        if (context.options.type !== CHART_TYPE.AREA) {
            return  false;
        }

        this._lineDrawer = context.getDrawerPluginByClass<LineDrawer>(LineDrawer);
        this._localDrawer = false;

        this._areaNode = new PlotGradient();
        this._areaNode.masterPlot = this._lineDrawer.node;

        if (!this._lineDrawer) {
            this._localDrawer = true;
            this._lineDrawer = new LineDrawer();
            this._lineDrawer.init(this.context);

            this.node.addChild(
                this._lineDrawer.node
            );
        }

        // we should suppress optimisation on this case
        this._lineDrawer.alwaysUpdate = true;

        this.node.zIndex = this._lineDrawer.node.zIndex - 1;
        this.node.addChild(this._areaNode);

        return true;
    }

    public update(): boolean {
        const style = this.getParsedStyle();
        const area = this._areaNode;

        if (this._localDrawer)
            this._lineDrawer.update(true);

        const fillColor = rgb2hex(style.fill as number[]);
        const fillAlpha = (<number[]> style.fill)[3];

        area.colorTop = area.colorBottom = fillColor;
        area.alphaTop = fillAlpha;
        area.alphaBottom = fillAlpha * 0.5;

        area.coordTop = 0;

        const viewport = this.context.limits;
        const dataBounds = this._lineDrawer.lastDrawnFetch.dataBounds;

        area.coordBottom = Math.max(viewport.height - dataBounds.fromY, viewport.height);

        area.tint = 0x1571D6;

        return true;
    }
}
