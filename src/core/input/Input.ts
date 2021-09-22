import { EventEmitter } from '@pixi/utils';
import type { Chart } from '../Chart';

/**
 * BaseInput class that provide a interface for subclasses that handle input for Charts
 */
export abstract class BaseInput extends EventEmitter {
    /**
     * Should be called when input a registered for specific chart
     * Can be invoked a more times for multichart apps
     */
    public abstract register (chart: Chart): void;

    /**
     * Should be called when need a unregister input provider from chart
     * Can be called multiple times with different charts
     */
    public abstract unregister (chart: Chart): void;

    /**
     * Should be called every update frame
     * @param deltaTime - delta time in ms between input frames
     */
    public abstract update (deltaTime: number): void;
}

