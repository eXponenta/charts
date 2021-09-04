import {DisplayObject} from "@pixi/display";
import {BaseDrawer} from "./BaseDrawer";
import {BACKEND_TYPE} from "./BACKEND_TYPE";

export class BasePIXIDrawer extends BaseDrawer {
	public static readonly BACKEND_TYPE = BACKEND_TYPE.PIXI;
	public readonly node: DisplayObject;
}
