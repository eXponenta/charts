import {Sprite} from "@pixi/sprite";
import {BaseDrawer} from "../BaseDrawer";
import type {Chart, IDataFetchResult, IObjectData} from "../../core/Chart";
import {LABEL_LOCATION} from "../../core/Chart";
import {Texture} from "@pixi/core";
import {Container} from "@pixi/display";
import {MIPMAP_MODES} from "@pixi/constants";

const LABEL_TICKS_THICKNESS = 1;
const LABEL_TICS = 5;
const LABEL_WIDTH = 40;

function getCanvasContext(canvas: HTMLCanvasElement | OffscreenCanvas, width: number, height: number): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D {
    canvas = canvas || (window.OffscreenCanvas
            ? new window.OffscreenCanvas(width, height)
            : document.createElement('canvas')
    );

    canvas.width = width;
    canvas.height = height;

    return canvas.getContext('2d');
}

export class TicksElement extends Container {
    public view: Sprite;
    private _texture: Texture;
    private _canvas: HTMLCanvasElement | OffscreenCanvas;

    constructor(public readonly horizontal = true) {
        super();

        this.view = new Sprite(Texture.WHITE);
        this.addChild(this.view)
    }

    public update(data: IObjectData, {
                      width = 0,
                      height = 0
                  })
    {
        const ctx = getCanvasContext(this._canvas, width, height);

        this._texture = this._texture || Texture.from(ctx.canvas as HTMLCanvasElement);
        this._texture.baseTexture.mipmap = MIPMAP_MODES.OFF;

        this._canvas = ctx.canvas;
        this.view.texture = this._texture;

        ctx.clearRect(0,0,width, height);
        ctx.lineWidth = 1;
        ctx.fillStyle = ctx.strokeStyle = 'black';
        ctx.font = 'Arial 16px';


        const passed = new Set();

        // regen
        for (let { x, y, labelX, labelY } of data as any) {
            const label = this.horizontal
                ? (labelX ?? x).toFixed(0)
                : (labelY ?? y).toFixed(0);

            if (passed.has(label)) {
                continue;
            }

            passed.add(label);

            if (this.horizontal) {
                ctx.moveTo(+x | 0, 0);
                ctx.lineTo(+x | 0, LABEL_TICS);

                ctx.fillText( label, (x | 0) - 15, LABEL_TICS * 4, 30);
            } else {

                ctx.moveTo((width - LABEL_TICS), y | 0);
                ctx.lineTo(width, y | 0);

                ctx.fillText( label, 0, y | 0);
            }

        }

        ctx.stroke();
        ctx.fill();

        this._texture.update();
    }

    public dispose() {
        if (!this._canvas) {
            return;
        }

        this._texture.destroy(true);
        this._canvas.width = this._canvas.height = 0;
        this._canvas = null;
    }
}

export class LabelsDrawer extends BaseDrawer {
    public node: Container = new Container();
    public name = 'LabelDrawer';

    private _xTicks: TicksElement;
    private _yTicks: TicksElement;

    public init(context: Chart): boolean {
        const {
            x, y
        } = context.options.style.labels;

        return (
            super.init(context) ||
            x.position === LABEL_LOCATION.NONE ||
            y.position === LABEL_LOCATION.NONE
        );
    }

    private _updateXAxis(data: IDataFetchResult<IObjectData>) {
        const {
            limits, options
        } = this.context;

        const yStyle = options.style.labels.y;
        const node = this.node;

        if (yStyle.position === LABEL_LOCATION.NONE) {
            if(this._yTicks) {
                this._yTicks.dispose()
                this._yTicks = null;
            }

            return;
        }

        const width = LABEL_WIDTH;
        const baseX = yStyle.position === LABEL_LOCATION.LEFT
                ? limits.fromX
                : limits.toX - width;

        if (!this._yTicks) {
            this._yTicks = new TicksElement(false);
            node.addChild(this._yTicks);
        }

        this._yTicks.update(data.data, {
            width : width,
            height: limits.height
        });

        this._yTicks.x = baseX;
        this._yTicks.y = 0;
    }

    private _updateYAxis(data: IDataFetchResult<IObjectData>) {
        const {
            limits, options
        } = this.context;

        const xStyle = options.style.labels.x;
        const node = this.node;

        if (xStyle.position === LABEL_LOCATION.NONE) {
            if(this._xTicks) {
                this._xTicks.dispose()
                this._xTicks = null;
            }

            return;
        }

        const width = LABEL_WIDTH;
        const base = xStyle.position === LABEL_LOCATION.TOP
            ? limits.fromY
            : limits.toY - width;

        if (!this._xTicks) {
            this._xTicks = new TicksElement(true);
            node.addChild(this._xTicks);
        }

        this._xTicks.update(data.data, {
            width : limits.width,
            height: width
        });

        this._xTicks.x = 0;
        this._xTicks.y = base;
    }


    public update(): boolean {
        const node = this.node;

        /*
        node.clear();
        node
            .beginFill(0xffffff)
            .lineStyle({width: LABEL_TICKS_THICKNESS, color: 0})
        */


        const data = this.context.dataProvider.fetch();

        this._updateXAxis(data);
        this._updateYAxis(data);

        super.update();

        return  true;
    }

    dispose() {
        super.dispose();

        this._xTicks && this._xTicks.dispose();
        this._yTicks && this._yTicks.dispose();
    }
}
