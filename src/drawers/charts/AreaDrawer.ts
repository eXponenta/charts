import {BasePIXIDrawer} from "../BasePIXIDrawer";
import type {Chart} from "../../core";
import { TARGET_TYPE, CHART_TYPE} from "../../core";
import {Container} from "@pixi/display";
import {Mesh, MeshGeometry, MeshMaterial} from "@pixi/mesh";
import {LineDrawer} from "./LineDrawer";
import {Texture} from "@pixi/core";
import {rgb2hex} from "@pixi/utils";
import {PlotGeometry} from "../../../pixi-candles/src";
import { BACKEND_TYPE } from "../BACKEND_TYPE";

export class AreaGeometry extends MeshGeometry {
    constructor() {
        super();
    }

    public set(
        points: Array<number>,
        baseY: number
    ): void {

        const count = points.length;
        const vertices = [];
        const uvs = [];
        const indices = [];

        let idx = 0;

        for (let i = 0; i < count; i += 2) {
            vertices.push(
                points[i],
                points[i + 1],
                points[i],
                baseY
            );

            uvs.push(
                i / count, 0,
                i / count, 1
            );
        }

        for (let i = 0; i < count - 3; i ++) {
            indices.push(
                i, i + 1, i + 2,
                i + 1, i + 3, i + 2,
            )
        }

        this.getBuffer('aVertexPosition').update(vertices);
        this.getBuffer('aTextureCoord').update(uvs);
        this.getIndex().update(new Uint16Array(indices));

        this._updateId = -1;
    }
}

export class AreaDrawer extends BasePIXIDrawer {
    public static readonly TARGET_TYPE: TARGET_TYPE = TARGET_TYPE.CHART;
    public static readonly CHART_TYPE: CHART_TYPE = CHART_TYPE.AREA;

    public readonly node = new Container();
    private readonly _areaNode: Mesh;
    private readonly _lineDrawer: LineDrawer;

    constructor(chart: Chart) {
        super(chart);

        this._lineDrawer = new LineDrawer(chart);
        // will trigger from this
        this._lineDrawer.unlink();
        this._areaNode = new Mesh<MeshMaterial>(new AreaGeometry(), new MeshMaterial(Texture.WHITE));

        this.node.addChild(
            this._areaNode,
            this._lineDrawer.node
        );
    }

    public update() {
        const node = this._areaNode;
        const style = this.getParsedStyle();
        const height = this.chart.viewport.height;

        this._lineDrawer.update(true);

        const points = (this._lineDrawer.node.geometry as PlotGeometry).points;

        (this._areaNode.geometry as AreaGeometry).set(points, height);

        node.tint = rgb2hex(style.fill as number[]);
        node.alpha = (<number[]> style.fill)[3];
    }
}
