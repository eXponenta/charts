import type {Chart, IChartStyle} from "../core/Chart";
import {CHART_TYPE} from "../core/CHART_TYPE";
import {TARGET_TYPE} from "../core/TARGET_TYPE";
import {BACKEND_TYPE} from "./BACKEND_TYPE";
import {CHART_EVENTS} from "../core/CHART_EVENTS";
import {parseStyle} from "./Utils";

export class BaseDrawer {
    public static readonly BACKEND_TYPE: BACKEND_TYPE = BACKEND_TYPE.NONE;
    public static readonly TARGET_TYPE: TARGET_TYPE = TARGET_TYPE.NONE;
    public static readonly CHART_TYPE: CHART_TYPE = CHART_TYPE.LINE;

    public get backendType() {
        return  (<any>this.constructor).BACKEND_TYPE;
    }

    public get targetType() {
        return  (<any>this.constructor).TARGET_TYPE;
    }

    public get chartType() {
        return  (<any>this.constructor).CHART_TYPE;
    }

    constructor (
        public readonly chart: Chart
    ) {
        this.link();
    }

    /**
     * Link for watching a chart upadtes
     * @protected
     */
    public link() {
        this.unlink();

        this.chart.on(CHART_EVENTS.UPDATE, this.update, this);
        this.chart.on(CHART_EVENTS.DESTROY, this.reset, this);
    }
    /**
     * Unlink from chart updates watchings
     * @protected
     */

    public unlink() {
        this.chart.off(CHART_EVENTS.UPDATE, this.update, this);
        this.chart.off(CHART_EVENTS.DESTROY, this.reset, this);
    }

    public update() {

    }

    public reset() {

    }


    public getParsedStyle(): IChartStyle {
        return parseStyle(this.chart.options.style);
    }
}

