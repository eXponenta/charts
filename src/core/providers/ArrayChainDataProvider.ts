import { IArrayChainData, IData, IDataProvider } from "../Chart";

export class ArrayChainDataProvider implements IDataProvider {
    private _externalData: Array<any> = [];

    constructor (
        public data: IData,
        public readonly label = false,
    ) {}

    protected _fetchValueInternal (index: number): any {
        const chain = this.data as IArrayChainData;
        const entry = chain[index];

        return this.label ? entry[0] : entry[1];
    }

    fetch(from: number = 0, to?: number): Array<number> {
        const chain = this.data as IArrayChainData;

        to = to || (chain.length - 1);
        to = Math.min(chain.length - 1, Math.max(from, to));

        if (from === 0 && to === this._externalData.length) {
            return this._externalData;
        }

        this._externalData.length = to - from;

        for (let i = 0; i < from - to; i ++) {
            this._externalData[i] = this._fetchValueInternal(i);
        }

        return this._externalData;
    }
}

