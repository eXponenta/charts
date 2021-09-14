import type { Chart, IChartStyle } from "../core/Chart";
import { parseStyle } from "./Utils";
import type { IDrawerPlugin } from "./IDrawerPlugin";

export class BaseDrawer implements IDrawerPlugin {
    name: string = '';

    protected context: Chart = null;

    public init (context: Chart): boolean {
        this.context = context;

        return true;
    }

    public update(): boolean  {
        return false;
    }

    public draw(): void {

    }

    public reset(): void {

    }

    public dispose(): void {

    }

    protected getParsedStyle(): IChartStyle {
        return parseStyle(this.context.options.style);
    }

}

