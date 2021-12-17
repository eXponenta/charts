import type { Series } from '../Series';
import { InteractionEvent, InteractionManager } from "@pixi/interaction";
import { BaseInput } from "./Input";

export class PixiInput extends BaseInput {
	private _charts: Set<Series> = new Set();
	private _eventsRegistered: boolean = false;

	constructor(
		public readonly provider: InteractionManager
	) {
		super();

		this._onPointerUp = this._onPointerUp.bind(this);
		this._onPointerDown = this._onPointerDown.bind(this);
		this._onPointerMove = this._onPointerDown.bind(this);
		this._onPointerTap = this._onPointerTap.bind(this);

		this._onWheel = this._onWheel.bind(this);
	}

	private _attachEvents() {
		if (this._eventsRegistered) {
			return;
		}

		const p = this.provider;

		p.on('pointerup', this._onPointerUp, this);
		p.on('pointerupoutside', this._onPointerUp, this);
        p.on('pointerdown', this._onPointerDown, this);
        p.on('pointermove', this._onPointerMove, this);
        p.on('pointertap', this._onPointerTap, this);

        // handle native wheel

        if ((p as any).interactionDOMElement) {
            (p as any).interactionDOMElement.addEventListener('wheel', this._onWheel, {passive: false})
        } else {
            document.addEventListener('wheel', this._onWheel, {passive: false});
        }

        this._eventsRegistered = true;
	}

	private _onWheel (event: WheelEvent) {
	    event.preventDefault();
    }

	private _onPointerTap (event: InteractionEvent) {

    }

	private _onPointerMove (event: InteractionEvent) {

    }

	private _onPointerUp (event: InteractionEvent) {

    }

    private _onPointerDown (event: InteractionEvent) {

    }

	private _detachEvents() {
		if (!this._eventsRegistered) {
			return;
		}

        const p = this.provider;

        p.off('pointerup', this._onPointerUp, this);
        p.off('pointerupoutside', this._onPointerUp, this);
        p.off('pointerdown', this._onPointerDown, this);
        p.off('pointermove', this._onPointerMove, this);
        p.off('pointertap', this._onPointerTap, this);

        // unlink
        if ((p as any).interactionDOMElement) {
            (p as any).interactionDOMElement.removeEventListener('wheel', this._onWheel)
        } else {
            document.removeEventListener('wheel', this._onWheel);
        }

		this._eventsRegistered = false;
	}

	public register(chart: Series): void {
		if (this._charts.has(chart))
			return;

		this._charts.add(chart);
		this._attachEvents();
	}

	public unregister(chart: Series): void {
		this._charts.delete(chart);

		if (this._charts.size === 0) {
			this._detachEvents();
		}
	}

	public update(deltaTime: number) {

    }
}
