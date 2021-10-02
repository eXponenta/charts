# API
_NOTE:_ API нестабильное и будет изменяться в процессе разработки!

# Pixi.charts
Пространство имен включающее все классы и типы (TS) библиотеки.

### Chart

_NOTE:_ Если вы используете библиотеку как UMD модуль, то требуется PixiJS версии >6 в качестве глобально зависимости.

Базовый класс который включает минимально необходимые компоненты для построения графиков без реализации pixi-контекста.
Не требует каких-то дополнительных конфигураций.

#### Chart.constructor (canvasOrID: HTMLCanvasElement | string)
Создает инстанс Chart на соответствующем элементе canvas.

Пример:
```html
    <script src="https://pixijs.download/v6.1.2/pixi.js"></script>
    <script src="./../dist/pixi-charts.umd.js"></script>
    <canvas id='app' width = 300 height = 200></canvas>
    <script>
        const app = new PIXI.charts.Chart('#app');
    </script>
```

#### Chart#add (data: ISeriesDataOptions | ISeriesDataOptions[] | IMultiSeriesDataOptions | Series, nested?: boolean): PIXI.charts.Chart

Создает Series или набор Series в контекст приложения под уникальным именем _name_ (при отсутствии будет вида: `chart_${count}`)
На данный момент только 1 приложение может использовать каждый график.

Количество графиков в приложении неограниченно.
`nested` - добавляет график к последнему (или первому в наборе) если свойство `parent` не установлено.
Используется для синхронизации графиков между собой (создания слоев в одном контексте по разным данным).

```javascript

    app.add({...}).add({...}, true);

```

#### Chart#addSeries (chart: PIXI.charts.Series, name?: string): PIXI.charts.Series

Добавляет инстанс Series в контекст приложения под уникальным именем _name_ (при отсутствии будет вида: `chart_${count}`)
На данный момент только 1 приложение может использовать каждый график.

Количество графиков в приложении неограниченно.

```javascript

    app.addSeries(new PIXI.chart.Series({...}), 'Series_1');

```
#### Chart#removeSeries (name: string): PIXI.charts.Series

Отвязывает от текущего приложения график по имени и возвращает его инстанс.
Может использоваться для смены графиков или их контекстов (не тестировалось на данный момент).

```javascript
    // remove chart from first App
    const series = app.removeSeries('Series_1');
    
    // move it to second
    app2.addSeries(series);

```

### Series

Класс-агрегатор данных которые представляют графики.
Является контейнером для непосредственно отрисовщиками обработчиков и провайдеров.
Для подробностей смотрите [Series Data Plugins](./src/core/plugins),  [Series Drawers](./src/core/drawers), [Chart Data Providers](./src/core/providers)


#### Series.constructor (options: ISeriesDataOptions, plugins?: IDrawerPlugin[])

Конструктор класса Chart.
 - `options` - объект конфигурации типа [ISeriesDataOptions](#iseriesdataoptions), обязательный аргумент.
 - `plugins` - список инстансов реализующих IDrawerPlugin, используется для замены или добавления специфичных и уникальных отрисовщиков для текущего инстанса Chart


```javascript
    app.addSeris(new PIXI.chart.Series({
        data: [...], // data is required, other is optional
    }), 'Series_1');
```
#### Series.registerPlugin (pluginCtor: new () => IDrawerPlugin)

Статически метод регистрирующий глобально отрисовщики подобно `plugins` аргумент конструтора.
Каждый инстанс класса Chart имеет уникальный набор инстансов отрисовщиков и вызывает конструктор класса изнутри.

Используется для глобальной регистрации (для всех инстансов) плагинов отрисовщиков.
<a name="ichartdataoptions"></a>
#### ISeriesDataOptions

Объект инициализации графиков, имеет одно обязательно поле `data`

Полный вид объекта (default):

```javascript
{
    type?: 'line', //'line' | 'area' | 'bar', bar - не поддерживается сейчас
    data: ..., // [{x, y}, {x, y}] | [[x, y], [x, y]] | [y, y, y, ] - массив данных для отображения
    name?: 'series_name',
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
