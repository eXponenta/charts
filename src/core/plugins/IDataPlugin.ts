import type { PluggableProvider } from "../providers";
import { IDataFetchResult } from "../Chart";

/**
 * Data plugin interface, used for transforming a passed data
 */
export interface IDataPlugin {
	/**
	 * Unique name for plugin
	 */
	name: string;

	/**
	 * Init method, called when a fetch process is begin run, before call fetch from data provider,
	 * should return true if plugin is ready to use when exist.
	 * Plugins without init always is active
	 * @param context - instance of current context that execute plugin, plugins is sharable and can be handled by different contexts
	 */
	init?(context: PluggableProvider): boolean;

	/**
	 * Called after init for preprocessing elements
	 * @param {*} data current processed record
	 * @param {IDataFetchResult<*>} source processed source returned from fetch of data provider
	 * @return Should return processed entry, NOT NULL!
	 */
	processElements?(data: any[], source: IDataFetchResult<any>): any[];

	/**
	 * Called on end of data processing, can mutate result fetch result structure or entry data (UNSAFE)
	 * @param result
	 * @param source
	 */
	processResult?(result: IDataFetchResult<any>, source: IDataFetchResult<any>): IDataFetchResult<any>;
}

/**
 * Function-based data transform
 */
export type IFunctionDataPlugin = (data: any[], source: IDataFetchResult<any>) => any[];
