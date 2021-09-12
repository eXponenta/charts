import { IArrayChainData, IDataFetchResult, IDataProvider } from "../Chart";
import { Range } from "../Range";
import { Observable } from "../Observable";

export class TransformedProvider implements IDataProvider {
    public readonly range: Range = new Range({
        fromX: 0, toX: 1, fromY: 0, toY: 1
    });
    private _updateId: number = 0;

    constructor(
        public sourceProvider: IDataProvider
    ) {
        this.range.on(Observable.CHANGE_EVENT, this.onChange);
    }

    private onChange(): void {
        this._updateId ++;
    }

    public get updateId(): number {
        return this._updateId;
    }

    public fetch(from?: number, to?: number): IDataFetchResult<IArrayChainData> {
        const result = {... this.sourceProvider.fetch(from, to) };
        result.dataBounds = { ... result.dataBounds };

        const {
            fromX, fromY, width, height
        } = this.range;

        const b = result.dataBounds;
        const dw = b.toX - b.fromX || 1;
        const dh = b.toY - b.fromY || 1;

        const sx = width / dw;
        const sy = height / dh;

        result.data = result.data.map((v, i) => {
            return [
                fromX + v[0] * sx, fromY + v[1] * sy
            ]
        });

        b.fromX += fromX;
        b.fromY += fromY;
        b.toX = fromX + width;
        b.toY = fromY + height;

        return result;
    }
}
