import { Renderer, BatchRenderer } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { Container } from "@pixi/display";

import { Chart, CHART_EVENTS } from "./core";
import {Ticker, UPDATE_PRIORITY} from "@pixi/ticker";

Renderer.registerPlugin('batch', BatchRenderer);
Renderer.registerPlugin('interaction', InteractionManager);

export class ChartApp {
    readonly ticker: Ticker = new Ticker();
    readonly renderer: Renderer;
    readonly stage: Container = new Container();
    readonly size: {
        width: number,
        height: number
    } = {
        width: 0, height: 0
    };

    constructor(canvasOrId: HTMLCanvasElement | string) {
        const view = canvasOrId instanceof HTMLCanvasElement
                ? canvasOrId
                : document.querySelector<HTMLCanvasElement>(canvasOrId);

        const scale = window.devicePixelRatio;
        this.size.width = view.clientWidth * scale;
        this.size.height = view.clientHeight * scale;
        this.renderer = new Renderer({
            view,
            width: this.size.width,
            height: this.size.height,
            backgroundAlpha: 0,
            useContextAlpha: true,
        });

        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.onDimensionUpdate = this.onDimensionUpdate.bind(this);
        this.onChartUpdate = this.onChartUpdate.bind(this);
        this.removeChart = this.removeChart.bind(this);

        //@ts-ignore
        new self.ResizeObserver(this.onDimensionUpdate).observe(view);

        this.ticker.add(this.update);
        this.ticker.add(this.draw, UPDATE_PRIORITY.LOW);

        this.ticker.start();
    }

    private onDimensionUpdate () {
        const view = this.renderer.view;
        this.size.width = view.clientWidth * window.devicePixelRatio;
        this.size.height = view.clientHeight * window.devicePixelRatio;

        this.renderer.resize(
            this.size.width,
            this.size.height
        );

        this.stage.children
            .forEach(e => (<Chart> e).setViewport(0,0, this.size.width, this.size.height) )
    }

    private onChartUpdate(chart: Chart) {
        // nothing
        // this.draw();
    }

    public addChart(chart: Chart, name = 'chart_' + this.stage.children.length): Chart {
        if (this.stage.children.includes(chart)) {
            return  chart;
        }

        chart.name = name;
        chart.setViewport(0,0, this.size.width, this.size.height);

        this._bindEvents(chart);

        this.stage.addChild(chart);

        return chart;
    }

    public removeChart(name: string): Chart {
        const chart: Chart = this.stage.children.find( (e: any) => e.name === name) as Chart;

        if (chart) {
            this._unbindEvents(chart);
            this.stage.removeChild(chart)
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

    protected update() {
        for (const chart of this.stage.children) {
            (<Chart> chart).update();
        }
    }

    protected draw() {
        let dirtyCharts = 0;

        for (const chart of this.stage.children) {
            if((<Chart> chart).draw()) {
                dirtyCharts ++;
            }
        }

        if (dirtyCharts !== 0) {
            this.renderer.render(this.stage);
        }
    }
}


