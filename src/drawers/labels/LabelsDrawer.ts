import {Graphics} from "@pixi/graphics";
import {BaseDrawer} from "../BaseDrawer";

export enum LABEL_ORIENTATION {
    LEFT = 'left',
    RIGHT = 'right',
}
export enum RENDER_MODE {
    NORMAL = 'normal',
    ONLY_X = 'only_x',
    ONLY_Y = 'only_y'
}

export class LabelsDrawer extends BaseDrawer {
    public node: Graphics = new Graphics();
    public name = 'LabelDrawer';

    public update(): boolean {
        const {
            range, limits
        } = this.context;

        const node = this.node;

        node.clear();

        node
            .beginFill(0xffffff)
            .lineStyle({width: 2, color: 0})
        // left bar
        node.drawRect(limits.fromX, limits.fromY, 40, limits.height);

        const data = this.context.dataProvider.fetch();

        for(let { y } of data.data) {
            if (y < limits.fromY || y > limits.toY)
                continue;

            node.moveTo(limits.fromX + 10, y);
            node.lineTo( limits.fromX + 40, y);
        }

        // bottom bar
        node.drawRect(limits.fromX, limits.toY - 40, limits.width, 40);

        for(let { x } of data.data) {
            if (x < limits.fromX || x > limits.toX)
                continue;

            node.moveTo(+x, limits.toY - 40);
            node.lineTo(+x, limits.toY - 40 + 30);
        }
        super.update();

        return  true;
    }
}
