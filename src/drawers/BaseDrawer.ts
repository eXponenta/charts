import type { Series} from "../core/Series";
import { parseStyle } from "./Utils";
import type { IDrawerPlugin } from "./IDrawerPlugin";
import {ISeriesStyle} from "../core/ISeriesDataOptions";

export class BaseDrawer implements IDrawerPlugin {
    name: string = '';

    protected context: Series = null;

    public init (context: Series): boolean {
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

    protected getParsedStyle(): ISeriesStyle {
        return parseStyle(this.context.options.style);
    }

}

