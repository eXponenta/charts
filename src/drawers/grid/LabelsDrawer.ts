import { BasePIXIDrawer } from "../../drawers/BasePIXIDrawer";
import { TARGET_TYPE } from "../../core/TARGET_TYPE";
import {Graphics} from "@pixi/graphics";

export enum LABEL_ORIENTATION {
    LEFT = 'left',
    RIGHT = 'right',
}
export enum RENDER_MODE {
    NORMAL = 'normal',
    ONLY_X = 'only_x',
    ONLY_Y = 'only_y'
}

export class LabelsDrawer extends BasePIXIDrawer {
    public static readonly TARGET_TYPE: TARGET_TYPE = TARGET_TYPE.LABELS;
    public node: Graphics = new Graphics();
    public orientation: LABEL_ORIENTATION = LABEL_ORIENTATION.LEFT;
    public renderMode: RENDER_MODE = RENDER_MODE.NORMAL;

    public update() {
        const {
            range, limits
        } = this.chart;

        const node = this.node;

        node.clear();

        node
            .beginFill(0xffffff)
            .lineStyle({width: 2, color: 0})
        // left bar
        node.drawRect(limits.fromX, limits.fromY, 40, limits.height);

        // bottom bar
        node.drawRect(limits.fromX, limits.toY - 40, limits.width, 40);

        super.update();
    }
}
