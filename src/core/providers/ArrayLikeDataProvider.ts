import { IArrayChainData, IData, IDataFetchResult, IDataProvider, ILabelData } from "../Chart";

export class ArrayLikeDataProvider implements IDataProvider {
    constructor(
        public data: IData,
        public readonly label = false,
        public step = 10) {}

    fetch (from: number = 0, to: number = this.data.length - 1): IDataFetchResult<IArrayChainData> {
        const arrayLike = this.data as Array<any>;

        to = to || (arrayLike.length - 1);
        to = Math.min(arrayLike.length - 1, Math.max(from, to));

        if (this.label) {
            return {
                data: arrayLike.slice(from, to) as IArrayChainData,
                fromX: from,
                toX: to,
                dataBounds: {
                    // @todo Compute bounds for label data
                    fromX: 0, toX: 0, fromY: 0, toY: 0,
                }
            };
        }

        let minY = Infinity;
        let maxY = -Infinity;

        const data = arrayLike.slice(from, to)
                .map((e: number, i) => {
                    minY = Math.min(e, minY);
                    maxY = Math.max(e, maxY);

                    return [ (i + from) * this.step, e];
                });

        return {
            data: data as IArrayChainData,
            fromX: from,
            toX: to,
            dataBounds: {
                fromX: data[0][0],
                toX: data[data.length - 1][0],
                fromY: minY,
                toY: maxY
            }
        };
    }
}
