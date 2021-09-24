# API
_NOTE:_ API нестабильное и будет изменяться в процессе разработки!

# Pixi.charts
Пространство имен включающее все классы и типы (TS) библиотеки.

### ChartApp

_NOTE:_ Если вы используете библиотеку как UMD модуль, то требуется PixiJS версии >6 в качестве глобально зависимости.

Базовый класс который включает минимально необходимые компоненты для построения графиков без реализации pixi-контекста.
Не требует каких-то дополнительных конфигураций.

#### ChartApp.constructor (canvasOrID: HTMLCanvasElement | string)
Создает инстанс ChartApp на соответствующем элементе canvas.

Пример:
```html
    <script src="https://pixijs.download/v6.1.2/pixi.js"></script>
    <script src="./../dist/pixi-charts.umd.js"></script>
    <canvas id='app' width = 300 height = 200></canvas>
    <script>
        const app = new PIXI.chartApp('#app');
    </script>
```

#### ChartApp#addChart (chart: PIXI.charts.Chart, name?: string): PIXI.charts.Chart

Добавляет инстанс Charts в контекст приложения под уникальным именем _name_ (при отсутствии будет вида: `chart_${count}`)
На данный момент только 1 приложение может использовать каждый график.

Количество графиков в приложении неограниченно.

```javascript

    app.addChart(new PIXI.chart.Chart({...}), 'Chart_1');

```
#### ChartApp#removeChart (name: string): PIXI.charts.Chart

Отвязывает от текущего приложения график по имени и возвращает его инстанс.
Может использоваться для смены графиков или их контекстов (не тестировалось на данный момент).

```javascript
    // remove chart from first App
    const chart = app.removeChart('Chart_1');
    
    // move it to second
    app2.addChart(chart, 'Chart_1');

```

### Chart

Класс-агрегатор данных которые представляют графики.
Является контейнером для непосредственно отрисовщиками обработчиков и провайдеров.
Для подробностей смотрите [Chart Data Plugins](./src/core/plugins),  [Chart Drawers](./src/core/drawers), [Chart Data Providers](./src/core/providers)


#### Chart.constructor (options: IChartDataOptions, plugins?: IDrawerPlugin[])

Конструктор класса Chart.
 - `options` - объект конфигурации типа [IChartDataOptions](#ichartdataoptions), обязательный аргумент.
 - `plugins` - список инстансов реализующих IDrawerPlugin, используется для замены или добавления специфичных и уникальных отрисовщиков для текущего инстанса Chart


```javascript
    app.addChart(new PIXI.chart.Chart({
        data: [...], // data is required, other is optional
    }), 'Chart_1');
```
#### Chart.registerPlugin (pluginCtor: new () => IDrawerPlugin)

Статически метод регистрирующий глобально отрисовщики подобно `plugins` аргумент конструтора.
Каждый инстанс класса Chart имеет уникальный набор инстансов отрисовщиков и вызывает конструктор класса изнутри.

Используется для глобальной регистрации (для всех инстансов) плагинов отрисовщиков.
<a name="ichartdataoptions"></a>
#### IChartDataOptions

Объект инициализации графиков, имеет одно обязательно поле `data`

Полный вид объекта (default):

```javascript
{
    type?: 'line', //'line' | 'area' | 'bar', bar - не поддерживается сейчас
    data: ..., // [{x, y}, {x, y}] | [[x, y], [x, y]] | [y, y, y, ] - массив данных для отображения
    style?:
    {
        fill?: 'rgba(0,0,0,1)',//number | string | [number, number, number, number] - цвет заполнения для area
        stroke?:'rgba(0,0,0,1)',// number  | string | [number, number, number, number] - цвет для линии
        thickness?: 2,// - толщина линии
        lineJoint?: 'round', // 'round', 'miter', 'bevel' - тип сочленения для линии
        clamp: true, // ограничение на свободное перемещение, при отключении возможны неверный отсечки
        fitYRange: false, // выравнивание высоты графика по видимой зоне
    }
}
```
