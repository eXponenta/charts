import { EventEmitter } from "@pixi/utils";

export class Observable<T> extends EventEmitter {
    public static CHANGE_EVENT = 'change';
    protected _dirtyId: number = 0;

    constructor (fields?: Array<string>) {
        super();

        if (fields) {
            this.wrap(fields, this);
        }
    }


    protected _broadcast (name?: string, oldValue?: any, newValue?: any): void {
        if (this._suspended) {
            return;
        }

        this.emit(Observable.CHANGE_EVENT, {
            target: this,
            name,
            oldValue,
            newValue
        });
    }

    protected _suspended = false;
    protected _dirtyBeforeSuspend: number = 0;

    /**
     * Suspend and not emit change events while suspended
     * @protected
     */
    public set suspended(v: boolean) {
        if (v === this._suspended) {
            return;
        }

        if (v) {
            this._dirtyBeforeSuspend = this._dirtyId;
            this._suspended = true;
        } else {
            this._suspended = false;

            if (this._dirtyId !== this._dirtyBeforeSuspend) {
                this._broadcast();
            }

            this._dirtyBeforeSuspend = -1;
        }
    }

    public get suspended () {
        return this._suspended;
    }

    public dirtyId () {
        return this._dirtyId;
    }

    protected wrap <T> (fields: Array<string>, target: any): Observable<T> {
        target = target as Observable<T>;

        for (const key of fields) {
            Object.defineProperty(target, key, {
                set (v: any) {
                    const old = this['_' + key];
                    this['_' + key] = v;

                    if (old !== v) {
                        target._dirtyId ++;
                        target._broadcast (key, old, v);
                    }
                },

                get () {
                    return this['_' + key];
                }
            })
        }

        return target;
    }
}
