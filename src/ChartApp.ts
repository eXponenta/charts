import { Renderer, BatchRenderer } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { Container } from "@pixi/display";

import { Chart} from "./core/Chart";
import { CHART_EVENTS } from "./core/CHART_EVENTS";

Renderer.registerPlugin('batch', BatchRenderer);
Renderer.registerPlugin('interaction', InteractionManager);

export class ChartApp {
    readonly renderer: Renderer;
    readonly stage: Container = new Container();

    constructor(canvasOrId: HTMLCanvasElement | string) {
        const view = canvasOrId instanceof HTMLCanvasElement
                ? canvasOrId
                : document.querySelector<HTMLCanvasElement>(canvasOrId);

        const scale = window.devicePixelRatio;
        this.renderer = new Renderer({
            view,
            width: view.clientWidth * scale,
            height: view.clientHeight * scale,
        });

        this.draw = this.draw.bind(this);
        this.onChartUpdate = this.onChartUpdate.bind(this);
        this.removeChart = this.removeChart.bind(this);
    }

    private onChartUpdate(chart: Chart) {
        this.draw();
    }

    public addChart(chart: Chart, name = 'chart_' + this.stage.children.length): Chart {
        if (this.stage.children.includes(chart)) {
            return  chart;
        }

        chart.name = name;

        this._bindEvents(chart);

        this.stage.addChild(chart);

        this.draw();

        return chart;
    }

    public removeChart(name: string): Chart {
        const chart: Chart = this.stage.children.find( (e: any) => e.name === name) as Chart;

        if (chart) {
            this._unbindEvents(chart);
            this.stage.removeChild(chart)
            this.draw();
        }


        return chart;
    }

    private _unbindEvents (chart: Chart): void {
        chart.off(CHART_EVENTS.UPDATE, this.onChartUpdate);
        chart.off(CHART_EVENTS.DESTROY, this.removeChart);
    }

    private _bindEvents (chart: Chart): void {
        chart.on(CHART_EVENTS.UPDATE, this.onChartUpdate);
        chart.on(CHART_EVENTS.DESTROY, this.removeChart);
    }

    public draw() {
        this.renderer.render(this.stage);
    }
}


