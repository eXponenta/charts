import {Container, IDestroyOptions} from "@pixi/display";

export enum CHART_EVENTS {
    UPDATE = 'chart:update',
    DESTROY = 'chart:destroy',
}

export interface IChartDataModel {

}

export class Chart extends Container {
    public name: string = '';

    constructor (
        private readonly data: IChartDataModel
    ) {
        super();
    }

    public destroy(_options?: IDestroyOptions | boolean): void {
        this.emit(CHART_EVENTS.DESTROY, this);

        super.destroy(_options);
    }
}
