import type { Chart, IArrayChainData, IDataFetchResult, IDataProvider } from "../Chart";

/**
 * Data plugin interface, used for transforming a passed data
 */
export interface IDataPlugin {
    /**
     * Unique name for plugin
     */
    name: string;
    /**
     * Init method, called when a fetch process is begin run, before call fetch from data provider
     * @param context - instance of current context that execute plugin, plugins is sharable and can be handled by different contexts
     */
    init ?(context: PluggableProvider): void;

    /**
     * Called every times while fetched elements is processed
     * @param {*} dataEntry current processed record
     * @param {IDataFetchResult<*>} source processed source returned from fetch of data provider
     * @param index global index of processed data (relative a source.data length)
     * @return Should return processed entry, NOT NULL!
     */
    processElement? (dataEntry: any, source: IDataFetchResult<any>, index: number): any;

    /**
     * Called on end of data processing, can mutate result fetch result structure or entry data (UNSAFE)
     * @param result
     * @param source
     */
    processResult? (result: IDataFetchResult<any>, source: IDataFetchResult<any>): IDataFetchResult<any>;
}

/**
 * Pluggable data Provider/Plugin, used for composite all plugins and providers together
 */
export class PluggableProvider implements IDataProvider, IDataPlugin {
    public readonly name = 'PluggableProvider';

    private static readonly plugins: IDataPlugin[] = [];

    public static registerPlugin (plugin: IDataPlugin): boolean {

        // process when plugin is not instance
        if (typeof plugin === 'function') {
            try {
                // is ctor
                plugin = new (<any>plugin)()
            } catch (e) {
                return false;
            }
        }

        if (!plugin || !(plugin.processElement || plugin.processResult)) {
            return false;
        }

        this.plugins.push(plugin);
    }

    private readonly _plugins: IDataPlugin[] = [];

    constructor(
        public sourceProvider: IDataProvider,
        public chart: Chart,
        plugins: IDataPlugin[] = []
    ) {
        this._plugins = [...PluggableProvider.plugins, ...plugins];
    }

    init() {
        for (const p of this._plugins) {
            p.init && p.init(this);
        }
    }

    processEntry (dataEntry: any, source: IDataFetchResult<any>, index: number): any
    {
        for (const p of this._plugins) {
            if (!p.processElement) {
                continue;
            }

            dataEntry = p.processElement(dataEntry, source, index);

            if (dataEntry == void 0) {
                throw new Error('Illegal output (null not allowed) by:' + p.name);
            }
        }

        return dataEntry;
    }

    processResult (result: IDataFetchResult<any>, source: IDataFetchResult<any>): IDataFetchResult<any>
    {
        for (const p of this._plugins) {
            if (!p.processResult) {
                continue;
            }

            result = p.processResult(result, source);
        }

        return result;
    }

    public fetch(from?: number, to?: number): IDataFetchResult<IArrayChainData> {
        this.init();

        const source = this.sourceProvider.fetch(from, to);
        let result = {... source };
        result.dataBounds = { ... result.dataBounds };

        const sourceData = result.data;
        const resultData = [];

        for (let i = 0, l = sourceData.length; i < l; ++i) {
            resultData.push(this.processEntry(sourceData[i], source, i));
        }

        result.data = resultData;
        result = this.processResult(result, source);

        return result;
    }
}

/**
 * Data transform plugin, used for converting a input data space to Chart range values,
 */
export class DataTransformPlugin implements IDataPlugin {
    public readonly name = 'DataTransformPlugin';

    private context: PluggableProvider;

    /**
     * @implements IDataPlugin
     * @inheritDoc
     */
    init(context: PluggableProvider) {
        this.context = context;
    }

    /**
     * @implements IDataPlugin
     * @inheritDoc
     */
    processElement(dataEntry: any, source: IDataFetchResult<any>, index: number): any {
        const {
            fromX, fromY, width, height
        } = this.context.chart.range;

        const b = source.dataBounds;
        const dw = b.toX - b.fromX || 1;
        const dh = b.toY - b.fromY || 1;

        const sx = width / dw;
        const sy = height / dh;

        return [
            fromX + dataEntry[0] * sx,
            height - (fromY + dataEntry[1] * sy) // flip
        ];
    }

    /**
     * @implements IDataPlugin
     * @inheritDoc
     */
    processResult(result: IDataFetchResult<any>, _source: IDataFetchResult<any>): IDataFetchResult<any> {
        const {
            fromX, fromY, width, height
        } = this.context.chart.range;

        const b = result.dataBounds;

        b.fromX += fromX;
        b.fromY += fromY;
        b.toX = fromX + width;
        b.toY = fromY + height;

        return result;
    }
}
