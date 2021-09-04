import {IData, IDataProvider} from "./Chart";

export class ArrayLikeDataProvider implements IDataProvider {
    constructor(public data: IData) {}

    fetch(from: number = 0, to: number = this.data.length - 1): Array<any> {
        const arrayLike = this.data as Array<any>;

        to = to || (arrayLike.length - 1);
        to = Math.min(arrayLike.length - 1, Math.max(from, to));

        if (from === 0 && to === arrayLike.length - 1) {
            return arrayLike;
        }

        return arrayLike.slice(from, to);
    }
}
