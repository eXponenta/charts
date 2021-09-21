import type { IDataPlugin } from "./IDataPlugin";
import type { PluggableProvider } from "../providers";
import type { IDataFetchResult } from "../Chart";

/**
 * Data plugin for generation a nice tics/labels
 */
export class FancyLabelsPlugin implements IDataPlugin {
    public readonly name: string = 'FancyLabelsPlugin';

    init (context: PluggableProvider): boolean {
        return true;
    }

    processElements(data: any[], source: IDataFetchResult<any>): any[] {
        return data;
    }

    processResult(result: IDataFetchResult<any>, source: IDataFetchResult<any>): IDataFetchResult<any> {
        return result;
    }
}
