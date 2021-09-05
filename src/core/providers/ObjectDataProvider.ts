import {IObjectData} from "../Chart";
import {ArrayChainDataProvider} from "./ArrayChainDataProvider";

export class ObjectDataProvider extends ArrayChainDataProvider {
	protected _fetchValueInternal(index: number): any {
		const chain = this.data as IObjectData;
		const entry = chain[index];

		return this.label ? entry.x : entry.y;
	}
}
