import { BasePIXIDrawer } from "../BasePIXIDrawer";
import { TARGET_TYPE } from "../../core/TARGET_TYPE";
import { Graphics } from "@pixi/graphics";

export class GridDrawer extends BasePIXIDrawer {
    public static readonly TARGET_TYPE: TARGET_TYPE = TARGET_TYPE.GRID;
    public node: Graphics = new Graphics();

    public update() {
        const {
            limits, range
        } = this.chart;

        let qX = 100 * range.width / limits.width;
        let qY = 100;

        if (qX > 200) {
            while (qX > 200)
                qX /= 2;
        } else  if (qX < 50) {
            while (qX < 50 )
                qX *= 2;
        }

        const fromX = limits.fromX + range.fromX > 0
                ? range.fromX % qX
                : (range.fromX % qX + qX);
        const toX = fromX + Math.round(limits.width / qX) * qX;

        const fromY = limits.fromY + ( range.toY > 0
            ? range.toY % qY
            : (range.toY % qY + qY)
        );
        const toY = fromY + Math.round(limits.height / qY) * qY;

        const node = this.node;

        node.clear()
            .lineStyle(2, 0xff0000, 0.4);

        for(let i = fromX; i <= toX; i += qX) {
            node.moveTo(i, limits.fromY);
            node.lineTo(i, limits.toY);
        }

        for(let i = fromY; i <= toY; i += qY) {
            node.moveTo(limits.fromX, limits.height - i);
            node.lineTo(limits.toX, limits.height - i);
        }

        super.update();
    }
}