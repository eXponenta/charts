import type { PluggableProvider } from "../providers";
import {IDataFetchResult, IObjectData} from "../Chart";

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
     * @param {IDataFetchResult<*>} result data fetch result that passed from previous plugin
	 * @param {IDataFetchResult<*>} source original source returned from fetch of data provider
	 * @return Should return processed entry, NOT NULL!
	 */
	processElements?(result: IDataFetchResult<IObjectData>, source: IDataFetchResult<IObjectData>): IDataFetchResult<IObjectData>;
}

/**
 * Function-based data transform
 */
export type IFunctionDataPlugin = (result: IDataFetchResult<IObjectData>, source: IDataFetchResult<any>) =>  IDataFetchResult<IObjectData>;
