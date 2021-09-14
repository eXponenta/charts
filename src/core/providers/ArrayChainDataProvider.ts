import { IArrayChainData, IData, IDataFetchResult, IDataProvider, IObjectData } from "../Chart";

export class ArrayChainDataProvider implements IDataProvider {

    constructor (
        public data: IData,
        public readonly label = false,
    ) {}

    protected _fetchValueInternal (index: number): any {
        const chain = this.data as IArrayChainData;
        const entry = chain[index];

        return this.label ? entry[0] : { x: entry[0], y: entry[1] };
    }

    fetch(from: number = 0, to?: number): IDataFetchResult<IObjectData>{
        const chain = this.data as IArrayChainData;

        to = to || (chain.length - 1);
        to = Math.min(chain.length - 1, Math.max(from, to));

        const data = [];

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (let i = 0; i < to - from; i ++) {
            data[i] = this._fetchValueInternal(i + from);

            if (!this.label) {
                minX = Math.min(data[i].x, minX);
                minY = Math.min(data[i].y, minY);
                maxX = Math.max(data[i].x, maxX);
                maxY = Math.max(data[i].y, maxY);
            }
        }

        return {
            data: data,
            fromX: from,
            toX: to,
            dataBounds: {
                fromX: minX,
                fromY: minY,
                toX: maxX,
                toY: maxY
            }
        };
    }
}

