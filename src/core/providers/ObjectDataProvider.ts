import {ArrayChainDataProvider} from "./ArrayChainDataProvider";
import {IObjectData} from "../ISeriesDataOptions";

export class ObjectDataProvider extends ArrayChainDataProvider {
	protected _fetchValueInternal(index: number): IObjectData[0] {
		const chain = this.data as IObjectData;
		const entry = chain[index];

		entry.labelX = entry.labelX ?? entry.x;
		entry.labelY = entry.labelY ?? entry.y;
		entry.index = index;

		return entry;
	}
}
