import type { Series} from "../Series";
import { IDataPlugin, IFunctionDataPlugin } from "../plugins/IDataPlugin";
import {IArrayChainData, IDataFetchResult, IDataProvider, IObjectData} from "../ISeriesDataOptions";

/**
 * Validate a type of plugin and return valid plugin
 * @param plugin
 */
function getPluginInstance (plugin: IDataPlugin | IFunctionDataPlugin): IDataPlugin | IFunctionDataPlugin | null
{
    if (!plugin) {
        return null;
    }

    if (typeof plugin === "function") {
        const proto = plugin.prototype;

        // () => {} not a have prototype
        if (!proto) {
            return plugin;
        }

        // class constructor
        if (
            'init' in proto ||
            'processElements' in proto ||
            'processResult' in proto
        ) {
            // is object constructor
            return new (<any>plugin)();
        }

        // regular function, i think, wrap
        return { name: plugin.name, processElements: plugin };
    }

    // object notated plugin
    if ( typeof plugin === 'object' &&
        (
            'init' in plugin ||
            'processElements' in plugin ||
            'processResult' in plugin
        )
    ) {
        return plugin;
    }

    return null;
}

/**
 * Pluggable data Provider/Plugin, used for composite all plugins and providers together
 */
export class PluggableProvider implements IDataProvider, IDataPlugin {
    public readonly name = 'PluggableProvider';

    private static readonly plugins: IDataPlugin[] = [];

    public static registerPlugin (plugin: IDataPlugin): boolean {

        plugin = getPluginInstance(plugin);

        if (!plugin) {
            return false;
        }

        this.plugins.push(plugin);

        return true;
    }

    private readonly _plugins: IDataPlugin[] = [];
    private readonly _activePlugins: IDataPlugin[] = [];
    private _sessionPlugins: IDataPlugin[] = [];

    constructor(
        public sourceProvider: IDataProvider,
        public chart: Series,
        plugins: IDataPlugin[] = []
    ) {
        this._plugins = [
            ...PluggableProvider.plugins,
            ...plugins.map(e => getPluginInstance(e)).filter(Boolean)
        ];
    }

    /**
     * Register session used plugins, sessions used plugins drops after fetch
     * @param {(IDataPlugin | IFunctionDataPlugin)[]} sessionPlugins
     */
    public use (...sessionPlugins: (IDataPlugin | IFunctionDataPlugin)[]): void {
        for (const p of sessionPlugins) {
            const valid = getPluginInstance(p);

            if (!valid) {
                continue;
            }

            this._sessionPlugins.push(valid);
        }
    }

    init(): boolean
    {
        this._activePlugins.length = 0;

        for (const p of this._plugins) {

            if (!p.init || p.init(this)) {
                this._activePlugins.push(p);
            }
        }

        for(const p of this._sessionPlugins) {
            if (!p.init || p.init(this)) {
                this._activePlugins.push(p);
            }
        }

        return  true;
    }

    processElements (result: IDataFetchResult<IObjectData>, source: IDataFetchResult<any>): IDataFetchResult<IObjectData>
    {
        for (const p of this._activePlugins) {
            if (!p.processElements) {
                continue;
            }

            result = p.processElements(result, source);

            if (!result || !result.data) {
                throw new Error('Illegal output (null not allowed) by:' + p.name);
            }
        }

        return result;
    }

    public fetch(from?: number, to?: number): IDataFetchResult<IObjectData> {
        this.init();

        const source = this.sourceProvider.fetch(from, to);
        let result = {... source };
        result.dataBounds = { ... result.dataBounds };

        result =  this.processElements(result, source);

        // disable plugins
        this._sessionPlugins.length = 0;
        this._activePlugins.length = 0;

        return result;
    }
}

