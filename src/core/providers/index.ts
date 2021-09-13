import { PluggableProvider, DataTransformPlugin } from './PluggableProvider';

export * from './ArrayChainDataProvider';
export * from './ArrayLikeDataProvider';
export * from './ObjectDataProvider';
export * from './PluggableProvider';

PluggableProvider.registerPlugin(DataTransformPlugin);
