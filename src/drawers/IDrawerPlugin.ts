import { DisplayObject } from "@pixi/display";
import { Chart } from "../core";

/**
 * Plugin interface for drawing something in chart
 */
export interface IDrawerPlugin {
    /**
     * Unique plugin name, used for lookup
     */
    name: string;

    /**
     * Drawable node that will be added onto scene tree, not all plugins require node.
     */
    node?: DisplayObject;

    /**
     * Init pluging, called once after Chart construction.
     * Should return true if exist for adding as drawer
     * Can be used for validating passed data to Charts
     * @param { Chart } context
     */
    init (context: Chart): boolean;

    /**
     * Called before draw every mutation (like viewport change etc), should return a true when a DRAW required
     * Can be used for dirty checking
     */
    update?(): boolean;

    /**
     * Called every draw request command (same as render in pixi)
     */
    draw?(): void;

    /**
     * Called when Chart is reconstructed fully, like before dispose or when component is removed from chart because data is changed
     * After reset will be called next init
     */
    reset?(): void;

    /**
     * Called when a chart is disposed fully, for clear all linked resources. Always after reset
     */
    dispose?(): void;
}
