import { Graphics } from "@pixi/graphics";
import { BaseDrawer } from "../BaseDrawer";
import { FancyLabelsPlugin } from "../../core/plugins/FancyLabelsPlugin";
import type {Chart} from "../../core";

export class GridDrawer extends BaseDrawer {
    public readonly name = 'GridDrawer';
    public node: Graphics = new Graphics();

    init(context: Chart): boolean {
        this.node.zIndex = -100;

        return super.init(context);
    }

    public update(): boolean {
        const {
            limits, range
        } = this.context;

        const node = this.node;
        this.context.dataProvider.use(FancyLabelsPlugin.instance)

        const data = this.context.dataProvider.fetch();

        node.clear()
            .lineStyle(2, 0xff0000, 0.2);

        for (const entry of data.data) {
            node.moveTo(entry.x, limits.fromY);
            node.lineTo(entry.x, limits.toY);

            node.moveTo(limits.fromX, limits.height - entry.y);
            node.lineTo(limits.toX, limits.height - entry.y);

        }

        super.update();
        return true;
    }
}
