import { Renderer, BatchRenderer } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { Container } from "@pixi/display";
import { Ticker, UPDATE_PRIORITY } from "@pixi/ticker";

import type { IMultiSeriesDataOptions, ISeriesDataOptions } from "./core/ISeriesDataOptions";
import { Series, CHART_EVENTS} from "./core/";
import { PixiInput } from "./core/input";

Renderer.registerPlugin('batch', BatchRenderer);
Renderer.registerPlugin('interaction', InteractionManager);

export class Chart {
    readonly series: Set<Series> = new Set<Series>();
    readonly ticker: Ticker = new Ticker();
    readonly renderer: Renderer;
    readonly stage: Container = new Container();
    readonly size: {
        width: number,
        height: number
    } = {
        width: 0, height: 0
    };

    readonly input: PixiInput;

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
        this.onDimensionUpdateLazy = this.onDimensionUpdateLazy.bind(this);
        this.onDimensionUpdate = this.onDimensionUpdate.bind(this);
        this.onSeriesUpdate = this.onSeriesUpdate.bind(this);
        this.removeSeries = this.removeSeries.bind(this);

        this.input = new PixiInput(this.renderer.plugins.interaction);

        //@ts-ignore
        if (self.ResizeObserver) {
            //@ts-ignore
            new self.ResizeObserver(this.onDimensionUpdateLazy).observe(view);
        }

        this.ticker.add(this.update);
        this.ticker.add(this.draw, UPDATE_PRIORITY.LOW);

        this.ticker.start();
    }

    private timeout: number = -1;
    private onResizeProcess: boolean = false;

    private onDimensionUpdateLazy() {
        self.clearTimeout(this.timeout);
        this.onResizeProcess = true;
        this.timeout = self.setTimeout(this.onDimensionUpdate, 100);
    }

    private onDimensionUpdate () {
        self.clearTimeout(this.timeout);
        this.onResizeProcess = false;
        this.timeout = -1;

        const view = this.renderer.view;
        this.size.width = view.clientWidth * window.devicePixelRatio;
        this.size.height = view.clientHeight * window.devicePixelRatio;

        this.renderer.resize(
            this.size.width,
            this.size.height
        );

        this.series
            .forEach(e => e.setViewport(0,0, this.size.width, this.size.height) )
    }

    private onSeriesUpdate(chart: Series) {
        // nothing
        // this.draw();
    }

    /**
     * Add chart series based on data objects passed as argument
     * @param data
     * @param nested - Series data will linked on latest added (or first if there are not) to follow transforming
     */
    public add ( data: ISeriesDataOptions | ISeriesDataOptions[] | IMultiSeriesDataOptions | Series, nested = false): this {
        // process Array of series options
        if (Array.isArray(data)) {
            for (const subdata of data) {
                this.add(subdata)
            }
            return this;
        }

        let parent: Series;
        if (data.parent instanceof Series) {
            parent = data.parent;

            if (!this.series.has(data.parent)) {
                console.warn('Series parent must be attached to same Chart');
                parent = null;
            }
        } else if (typeof data.parent === "string" && data.parent) {
            parent = this.getByName(data.parent);

            if (!parent) {
                console.warn(`Parent by name:${data.parent} wasn't find`);
            }
        }

        if (!parent && nested) {
            parent = this.tall;
        }

        if (data instanceof Series) {
            this.addSeries(data);
            return;
        }

        // process multi series data
        if ('datasets' in data && Array.isArray(data.datasets)) {
            // process Array of series options
            for (let i = 0; i < data.datasets.length; i ++) {
                const style = data.styles ? data.styles[Math.min(i, data.styles.length - 1)] : void 0;
                const name = `${data.name || ('series_' + this.stage.children.length)}:${i}`;
                const series = new Series(
                    {
                        name: name,
                        type: data.type,
                        parent: parent,
                        data: data.datasets[i],
                        style: style,
                    } as ISeriesDataOptions
                );

                // use first chart as parent for others
                if (i === 0 && !parent) {
                    parent = series;
                }

                this.addSeries(series);
            }

            return this;
        }

        data.parent = parent;

        this.addSeries(new Series(data as ISeriesDataOptions));

        return  this;
    }

    public getByName(name: string): Series | null {
        for (const s of  this.series) {
            if (s.name === name) {
                return s;
            }
        }

        return null;
    }

    public get tall(): Series | null {
        return [...this.series].pop();
    }

    public addSeries(series: Series, name = 'series_' + this.stage.children.length): Series {
        if (this.series.has(series)) {
            return  series;
        }

        // resolve parent;
        this.series.add(series);

        series.name = series.name || name;
        series.setViewport(0,0, this.size.width, this.size.height);

        this._bindEvents(series);

        let parent: Series | string = series.options.parent;

        if (typeof parent === 'string') {
            parent = this.getByName(parent);
        }else if (parent instanceof Series && !this.series.has(parent)) {
            parent = null;
        }

        series.bind(this, parent as Series);

        this.stage.addChild(series.node);

        return series;
    }

    public removeSeries(name: string): Series {
        const series = this.getByName(name);
        if (!series) {
            return ;
        }

        this._unbindEvents(series);
        this.series.delete(series);

        series.unbind(this);

        for (let other of this.series) {
            if (other.parent === series) {
                console.warn(`Parent series for ${other.name} was removed`);
                other.unbind(this);
                other.bind(this, null);
            }
        }

        this.stage.removeChild(series.node)

        return series;
    }

    private _unbindEvents (chart: Series): void {
        this.input.unregister(chart);

        chart.off(CHART_EVENTS.UPDATE, this.onSeriesUpdate);
        chart.off(CHART_EVENTS.DESTROY, this.removeSeries);
    }

    private _bindEvents (chart: Series): void {
        chart.on(CHART_EVENTS.UPDATE, this.onSeriesUpdate);
        chart.on(CHART_EVENTS.DESTROY, this.removeSeries);

        this.input.register(chart);
    }

    protected update() {
        this.input.update(this.ticker.elapsedMS);

        for (const series of this.series) {
            series.update();
        }
    }

    protected draw() {
        if (this.onResizeProcess) {
            return;
        }

        let dirtySeries = 0;

        for (const series of this.series) {
            if(series.draw()) {
                dirtySeries ++;
            }
        }

        if (dirtySeries !== 0) {
            this.renderer.render(this.stage);
        }
    }
}


