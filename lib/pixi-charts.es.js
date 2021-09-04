/* eslint-disable */
 
/*!
 * @pixi/charts - v0.1.0
 * Compiled Sat, 04 Sep 2021 16:05:49 UTC
 *
 * @pixi/charts is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Konstantin Timoshenko, All Rights Reserved
 */
import { Container, DisplayObject, TemporaryDisplayObject } from '@pixi/display';
import { EventEmitter } from '@pixi/utils';
import { Graphics } from '@pixi/graphics';
import { Renderer, BatchRenderer } from '@pixi/core';
import { Point } from '@pixi/math';

class Observable extends EventEmitter {
     static __initStatic() {this.CHANGE_EVENT = 'change';}
     __init() {this._dirtyId = 0;}

    constructor (fields) {
        super();Observable.prototype.__init.call(this);Observable.prototype.__init2.call(this);Observable.prototype.__init3.call(this);
        if (fields) {
            this.wrap(fields, this);
        }
    }


     _broadcast (name, oldValue, newValue) {
        if (this._suspended) {
            return;
        }

        this.emit(Observable.CHANGE_EVENT, {
            target: this,
            name,
            oldValue,
            newValue
        });
    }

     __init2() {this._suspended = false;}
     __init3() {this._dirtyBeforeSuspend = 0;}

    /**
     * Suspend and not emit change events while suspended
     * @protected
     */
     set suspended(v) {
        if (v === this._suspended) {
            return;
        }

        if (v) {
            this._dirtyBeforeSuspend = this._dirtyId;
            this._suspended = true;
        } else {
            this._suspended = false;

            if (this._dirtyId !== this._dirtyBeforeSuspend) {
                this._broadcast();
            }

            this._dirtyBeforeSuspend = -1;
        }
    }

     get suspended () {
        return this._suspended;
    }

     dirtyId () {
        return this._dirtyId;
    }

     wrap  (fields, target) {
        target = target ;

        for (const key of fields) {
            Object.defineProperty(target, key, {
                set (v) {
                    const old = this['_' + key];
                    this['_' + key] = v;

                    if (old !== v) {
                        target._dirtyId ++;
                        target._broadcast (key, old, v);
                    }
                },

                get () {
                    return this['_' + key];
                }
            });
        }

        return target;
    }
} Observable.__initStatic();

class Range extends Observable {
    
    
    
    

    
    
    
    

    constructor (data = {}) {
        super([
            'fromX', 'fromY', 'toX', 'toY'
        ]);

        data && this.set(data);
    }

     set ({ fromX = this._fromX, fromY = this._fromY, toX = this._toX, toY = this._toY } = {}) {
        this.suspended = true;

        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;

        this.suspended = false;
    }
}

class ArrayChainDataProvider  {
     __init() {this._externalData = [];}

    constructor (
         data,
          label = false,
    ) {this.data = data;this.label = label;ArrayChainDataProvider.prototype.__init.call(this);}

     _fetchValueInternal (index) {
        const chain = this.data ;
        const entry = chain[index];

        return this.label ? entry[0] : entry[1];
    }

    fetch(from = 0, to) {
        const chain = this.data ;

        to = to || (chain.length - 1);
        to = Math.min(chain.length - 1, Math.max(from, to));

        if (from === 0 && to === this._externalData.length) {
            return this._externalData;
        }

        this._externalData.length = to - from;

        for (let i = 0; i < from - to; i ++) {
            this._externalData[i] = this._fetchValueInternal(i);
        }

        return this._externalData;
    }
}

class ObjectDataProvider extends ArrayChainDataProvider {
	 _fetchValueInternal(index) {
		const chain = this.data ;
		const entry = chain[index];

		return this.label ? entry.x : entry.y;
	}
}

class ArrayLikeDataProvider  {
    constructor( data) {this.data = data;}

    fetch(from = 0, to = this.data.length - 1) {
        const arrayLike = this.data ;

        to = to || (arrayLike.length - 1);
        to = Math.min(arrayLike.length - 1, Math.max(from, to));

        if (from === 0 && to === arrayLike.length - 1) {
            return arrayLike;
        }

        return arrayLike.slice(from, to);
    }
}

var CHART_TYPE; (function (CHART_TYPE) {
    const BAR = 'bar'; CHART_TYPE["BAR"] = BAR;
    const LINE = 'line'; CHART_TYPE["LINE"] = LINE;
    const FILL = 'area'; CHART_TYPE["FILL"] = FILL;
})(CHART_TYPE || (CHART_TYPE = {}));

var TARGET_TYPE; (function (TARGET_TYPE) {
	const NONE = 'none'; TARGET_TYPE["NONE"] = NONE;
	const CHART = 'chart'; TARGET_TYPE["CHART"] = CHART;
	const LABELS = 'labels'; TARGET_TYPE["LABELS"] = LABELS;
	const GRID = 'grid'; TARGET_TYPE["GRID"] = GRID;
})(TARGET_TYPE || (TARGET_TYPE = {}));

var BACKEND_TYPE; (function (BACKEND_TYPE) {
	const NONE = 'none'; BACKEND_TYPE["NONE"] = NONE;
	const PIXI = 'pixi'; BACKEND_TYPE["PIXI"] = PIXI;
})(BACKEND_TYPE || (BACKEND_TYPE = {}));

var CHART_EVENTS; (function (CHART_EVENTS) {
	const UPDATE = 'chart:update'; CHART_EVENTS["UPDATE"] = UPDATE;
	const DESTROY = 'chart:destroy'; CHART_EVENTS["DESTROY"] = DESTROY;
})(CHART_EVENTS || (CHART_EVENTS = {}));

class BaseDrawer {
     static  __initStatic() {this.BACKEND_TYPE = BACKEND_TYPE.NONE;}
     static  __initStatic2() {this.TARGET_TYPE = TARGET_TYPE.NONE;}
     static  __initStatic3() {this.CHART_TYPE = CHART_TYPE.LINE;}

     get backendType() {
        return  (this.constructor).BACKEND_TYPE;
    }

     get targetType() {
        return  (this.constructor).TARGET_TYPE;
    }

     get chartType() {
        return  (this.constructor).CHART_TYPE;
    }

    constructor (
          chart
    ) {this.chart = chart;
        this.chart.on(CHART_EVENTS.UPDATE, this.update, this);
        this.chart.on(CHART_EVENTS.DESTROY, this.reset, this);
    }

     update() {

    }

     reset() {

    }
} BaseDrawer.__initStatic(); BaseDrawer.__initStatic2(); BaseDrawer.__initStatic3();

class BasePIXIDrawer extends BaseDrawer {
	 static  __initStatic() {this.BACKEND_TYPE = BACKEND_TYPE.PIXI;}
	
} BasePIXIDrawer.__initStatic();

class LineGraphicsDrawer extends BasePIXIDrawer {constructor(...args) { super(...args); LineGraphicsDrawer.prototype.__init.call(this);LineGraphicsDrawer.prototype.__init2.call(this);LineGraphicsDrawer.prototype.__init3.call(this); }
     static  __initStatic() {this.CHART_TYPE = CHART_TYPE.LINE;}
     static  __initStatic2() {this.TARGET_TYPE = TARGET_TYPE.CHART;}

     __init() {this._lastDirtyId = 0;}
     __init2() {this._dirtyId = -1;}

      __init3() {this.node = new Graphics();}

     update() {
        const node = this.node;
        this.chart.range;

        const {
            dataProvider
        } = this.chart;

        node.clear();

        const width = 300;
        const height = 200;

        const data = dataProvider.fetch() ;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const step = width / data.length;

        node.lineStyle({
            width:2, color: 0xff0000
        });

        for (let i = 0; i < data.length; i ++) {
            const x = step * i;
            const y = height * (data[i] - min) / (max - min);

            if (i === 0) {
                node.moveTo(x, y);
            } else {
                node.lineTo(x, y);
            }
        }
    }

    reset() {
        this.node.clear();
    }
} LineGraphicsDrawer.__initStatic(); LineGraphicsDrawer.__initStatic2();

class Chart extends Container {
     __init() {this.name = '';}
      __init2() {this.range = new Range();}
    
    
    

    
    

    constructor (
          options
    ) {
        super();this.options = options;Chart.prototype.__init.call(this);Chart.prototype.__init2.call(this);
        this.onRangeChanged = this.onRangeChanged.bind(this);

        this.range.on(Observable.CHANGE_EVENT, this.onRangeChanged);

        this.chartDrawer = new LineGraphicsDrawer(this);

        const drawers = [
            this.gridDrawer, this.chartDrawer, this.labelDrawer
        ].filter(Boolean).map(e => e.node);

        this.addChild(...drawers);

        this.parse();
    }

     onRangeChanged (_field, _old, _newValue) {
        this._emitUpdate();
    }

     parse() {
        const data = this.options.data;
        const labels = this.options.labels;

        let primitiveData;

        // parse data source
        if ('data' in data) {
            if ('fetch' in data) {
                this.dataProvider = data;
                this.labelProvider = labels ;
                return;
            } else {
                primitiveData = data.data;
            }
        } else {
            primitiveData = data ;
        }

        const firstEntry = primitiveData[0];

        // array like
        if (Array.isArray(firstEntry) && firstEntry.length === 2) {
            this.dataProvider = new ArrayChainDataProvider(primitiveData, false);
            this.labelProvider = new ArrayChainDataProvider(primitiveData, true);
            return;
        }

        // object like
        if (typeof firstEntry === 'object' && ('x' in firstEntry) && ('y' in firstEntry)) {
            this.dataProvider = new ObjectDataProvider(primitiveData, false);
            this.labelProvider = new ObjectDataProvider(primitiveData, true);
            return;
        }

        // is array

        this.dataProvider = new ArrayLikeDataProvider(primitiveData);
        // TODO
        // Generate a labels when it not present
        this.labelProvider = new ArrayLikeDataProvider(labels );

        this._emitUpdate();
    }

     destroy(_options) {
        this.emit(CHART_EVENTS.DESTROY, this);

        super.destroy(_options);
    }

     _emitUpdate() {
        this.emit(CHART_EVENTS.UPDATE, this);
    }
}

var appleIphone = /iPhone/i;
var appleIpod = /iPod/i;
var appleTablet = /iPad/i;
var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
var androidTablet = /Android/i;
var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
var amazonTablet = /Silk/i;
var windowsPhone = /Windows Phone/i;
var windowsTablet = /\bWindows(?:.+)ARM\b/i;
var otherBlackBerry = /BlackBerry/i;
var otherBlackBerry10 = /BB10/i;
var otherOpera = /Opera Mini/i;
var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
var otherFirefox = /Mobile(?:.+)Firefox\b/i;
var isAppleTabletOnIos13 = function (navigator) {
    return (typeof navigator !== 'undefined' &&
        navigator.platform === 'MacIntel' &&
        typeof navigator.maxTouchPoints === 'number' &&
        navigator.maxTouchPoints > 1 &&
        typeof MSStream === 'undefined');
};
function createMatch(userAgent) {
    return function (regex) { return regex.test(userAgent); };
}
function isMobile$1(param) {
    var nav = {
        userAgent: '',
        platform: '',
        maxTouchPoints: 0
    };
    if (!param && typeof navigator !== 'undefined') {
        nav = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints || 0
        };
    }
    else if (typeof param === 'string') {
        nav.userAgent = param;
    }
    else if (param && param.userAgent) {
        nav = {
            userAgent: param.userAgent,
            platform: param.platform,
            maxTouchPoints: param.maxTouchPoints || 0
        };
    }
    var userAgent = nav.userAgent;
    var tmp = userAgent.split('[FBAN');
    if (typeof tmp[1] !== 'undefined') {
        userAgent = tmp[0];
    }
    tmp = userAgent.split('Twitter');
    if (typeof tmp[1] !== 'undefined') {
        userAgent = tmp[0];
    }
    var match = createMatch(userAgent);
    var result = {
        apple: {
            phone: match(appleIphone) && !match(windowsPhone),
            ipod: match(appleIpod),
            tablet: !match(appleIphone) &&
                (match(appleTablet) || isAppleTabletOnIos13(nav)) &&
                !match(windowsPhone),
            universal: match(appleUniversal),
            device: (match(appleIphone) ||
                match(appleIpod) ||
                match(appleTablet) ||
                match(appleUniversal) ||
                isAppleTabletOnIos13(nav)) &&
                !match(windowsPhone)
        },
        amazon: {
            phone: match(amazonPhone),
            tablet: !match(amazonPhone) && match(amazonTablet),
            device: match(amazonPhone) || match(amazonTablet)
        },
        android: {
            phone: (!match(windowsPhone) && match(amazonPhone)) ||
                (!match(windowsPhone) && match(androidPhone)),
            tablet: !match(windowsPhone) &&
                !match(amazonPhone) &&
                !match(androidPhone) &&
                (match(amazonTablet) || match(androidTablet)),
            device: (!match(windowsPhone) &&
                (match(amazonPhone) ||
                    match(amazonTablet) ||
                    match(androidPhone) ||
                    match(androidTablet))) ||
                match(/\bokhttp\b/i)
        },
        windows: {
            phone: match(windowsPhone),
            tablet: match(windowsTablet),
            device: match(windowsPhone) || match(windowsTablet)
        },
        other: {
            blackberry: match(otherBlackBerry),
            blackberry10: match(otherBlackBerry10),
            opera: match(otherOpera),
            firefox: match(otherFirefox),
            chrome: match(otherChrome),
            device: match(otherBlackBerry) ||
                match(otherBlackBerry10) ||
                match(otherOpera) ||
                match(otherFirefox) ||
                match(otherChrome)
        },
        any: false,
        phone: false,
        tablet: false
    };
    result.any =
        result.apple.device ||
            result.android.device ||
            result.windows.device ||
            result.other.device;
    result.phone =
        result.apple.phone || result.android.phone || result.windows.phone;
    result.tablet =
        result.apple.tablet || result.android.tablet || result.windows.tablet;
    return result;
}

/*!
 * @pixi/settings - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/settings is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

// The ESM/CJS versions of ismobilejs only
var isMobile = isMobile$1(self.navigator);

/**
 * The maximum recommended texture units to use.
 * In theory the bigger the better, and for desktop we'll use as many as we can.
 * But some mobile devices slow down if there is to many branches in the shader.
 * So in practice there seems to be a sweet spot size that varies depending on the device.
 *
 * In v4, all mobile devices were limited to 4 texture units because for this.
 * In v5, we allow all texture units to be used on modern Apple or Android devices.
 *
 * @private
 * @param {number} max
 * @returns {number}
 */
function maxRecommendedTextures(max) {
    var allowMax = true;
    if (isMobile.tablet || isMobile.phone) {
        if (isMobile.apple.device) {
            var match = (navigator.userAgent).match(/OS (\d+)_(\d+)?/);
            if (match) {
                var majorVersion = parseInt(match[1], 10);
                // Limit texture units on devices below iOS 11, which will be older hardware
                if (majorVersion < 11) {
                    allowMax = false;
                }
            }
        }
        if (isMobile.android.device) {
            var match = (navigator.userAgent).match(/Android\s([0-9.]*)/);
            if (match) {
                var majorVersion = parseInt(match[1], 10);
                // Limit texture units on devices below Android 7 (Nougat), which will be older hardware
                if (majorVersion < 7) {
                    allowMax = false;
                }
            }
        }
    }
    return allowMax ? max : 4;
}

/**
 * Uploading the same buffer multiple times in a single frame can cause performance issues.
 * Apparent on iOS so only check for that at the moment
 * This check may become more complex if this issue pops up elsewhere.
 *
 * @private
 * @returns {boolean}
 */
function canUploadSameBuffer() {
    return !isMobile.apple.device;
}

/*!
 * @pixi/constants - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/**
 * Different types of environments for WebGL.
 *
 * @static
 * @memberof PIXI
 * @name ENV
 * @enum {number}
 * @property {number} WEBGL_LEGACY - Used for older v1 WebGL devices. PixiJS will aim to ensure compatibility
 *  with older / less advanced devices. If you experience unexplained flickering prefer this environment.
 * @property {number} WEBGL - Version 1 of WebGL
 * @property {number} WEBGL2 - Version 2 of WebGL
 */
var ENV;
(function (ENV) {
    ENV[ENV["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
    ENV[ENV["WEBGL"] = 1] = "WEBGL";
    ENV[ENV["WEBGL2"] = 2] = "WEBGL2";
})(ENV || (ENV = {}));
/**
 * Constant to identify the Renderer Type.
 *
 * @static
 * @memberof PIXI
 * @name RENDERER_TYPE
 * @enum {number}
 * @property {number} UNKNOWN - Unknown render type.
 * @property {number} WEBGL - WebGL render type.
 * @property {number} CANVAS - Canvas render type.
 */
var RENDERER_TYPE;
(function (RENDERER_TYPE) {
    RENDERER_TYPE[RENDERER_TYPE["UNKNOWN"] = 0] = "UNKNOWN";
    RENDERER_TYPE[RENDERER_TYPE["WEBGL"] = 1] = "WEBGL";
    RENDERER_TYPE[RENDERER_TYPE["CANVAS"] = 2] = "CANVAS";
})(RENDERER_TYPE || (RENDERER_TYPE = {}));
/**
 * Bitwise OR of masks that indicate the buffers to be cleared.
 *
 * @static
 * @memberof PIXI
 * @name BUFFER_BITS
 * @enum {number}
 * @property {number} COLOR - Indicates the buffers currently enabled for color writing.
 * @property {number} DEPTH - Indicates the depth buffer.
 * @property {number} STENCIL - Indicates the stencil buffer.
 */
var BUFFER_BITS;
(function (BUFFER_BITS) {
    BUFFER_BITS[BUFFER_BITS["COLOR"] = 16384] = "COLOR";
    BUFFER_BITS[BUFFER_BITS["DEPTH"] = 256] = "DEPTH";
    BUFFER_BITS[BUFFER_BITS["STENCIL"] = 1024] = "STENCIL";
})(BUFFER_BITS || (BUFFER_BITS = {}));
/**
 * Various blend modes supported by PIXI.
 *
 * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
 * Anything else will silently act like NORMAL.
 *
 * @memberof PIXI
 * @name BLEND_MODES
 * @enum {number}
 * @property {number} NORMAL
 * @property {number} ADD
 * @property {number} MULTIPLY
 * @property {number} SCREEN
 * @property {number} OVERLAY
 * @property {number} DARKEN
 * @property {number} LIGHTEN
 * @property {number} COLOR_DODGE
 * @property {number} COLOR_BURN
 * @property {number} HARD_LIGHT
 * @property {number} SOFT_LIGHT
 * @property {number} DIFFERENCE
 * @property {number} EXCLUSION
 * @property {number} HUE
 * @property {number} SATURATION
 * @property {number} COLOR
 * @property {number} LUMINOSITY
 * @property {number} NORMAL_NPM
 * @property {number} ADD_NPM
 * @property {number} SCREEN_NPM
 * @property {number} NONE
 * @property {number} SRC_IN
 * @property {number} SRC_OUT
 * @property {number} SRC_ATOP
 * @property {number} DST_OVER
 * @property {number} DST_IN
 * @property {number} DST_OUT
 * @property {number} DST_ATOP
 * @property {number} SUBTRACT
 * @property {number} SRC_OVER
 * @property {number} ERASE
 * @property {number} XOR
 */
var BLEND_MODES;
(function (BLEND_MODES) {
    BLEND_MODES[BLEND_MODES["NORMAL"] = 0] = "NORMAL";
    BLEND_MODES[BLEND_MODES["ADD"] = 1] = "ADD";
    BLEND_MODES[BLEND_MODES["MULTIPLY"] = 2] = "MULTIPLY";
    BLEND_MODES[BLEND_MODES["SCREEN"] = 3] = "SCREEN";
    BLEND_MODES[BLEND_MODES["OVERLAY"] = 4] = "OVERLAY";
    BLEND_MODES[BLEND_MODES["DARKEN"] = 5] = "DARKEN";
    BLEND_MODES[BLEND_MODES["LIGHTEN"] = 6] = "LIGHTEN";
    BLEND_MODES[BLEND_MODES["COLOR_DODGE"] = 7] = "COLOR_DODGE";
    BLEND_MODES[BLEND_MODES["COLOR_BURN"] = 8] = "COLOR_BURN";
    BLEND_MODES[BLEND_MODES["HARD_LIGHT"] = 9] = "HARD_LIGHT";
    BLEND_MODES[BLEND_MODES["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
    BLEND_MODES[BLEND_MODES["DIFFERENCE"] = 11] = "DIFFERENCE";
    BLEND_MODES[BLEND_MODES["EXCLUSION"] = 12] = "EXCLUSION";
    BLEND_MODES[BLEND_MODES["HUE"] = 13] = "HUE";
    BLEND_MODES[BLEND_MODES["SATURATION"] = 14] = "SATURATION";
    BLEND_MODES[BLEND_MODES["COLOR"] = 15] = "COLOR";
    BLEND_MODES[BLEND_MODES["LUMINOSITY"] = 16] = "LUMINOSITY";
    BLEND_MODES[BLEND_MODES["NORMAL_NPM"] = 17] = "NORMAL_NPM";
    BLEND_MODES[BLEND_MODES["ADD_NPM"] = 18] = "ADD_NPM";
    BLEND_MODES[BLEND_MODES["SCREEN_NPM"] = 19] = "SCREEN_NPM";
    BLEND_MODES[BLEND_MODES["NONE"] = 20] = "NONE";
    BLEND_MODES[BLEND_MODES["SRC_OVER"] = 0] = "SRC_OVER";
    BLEND_MODES[BLEND_MODES["SRC_IN"] = 21] = "SRC_IN";
    BLEND_MODES[BLEND_MODES["SRC_OUT"] = 22] = "SRC_OUT";
    BLEND_MODES[BLEND_MODES["SRC_ATOP"] = 23] = "SRC_ATOP";
    BLEND_MODES[BLEND_MODES["DST_OVER"] = 24] = "DST_OVER";
    BLEND_MODES[BLEND_MODES["DST_IN"] = 25] = "DST_IN";
    BLEND_MODES[BLEND_MODES["DST_OUT"] = 26] = "DST_OUT";
    BLEND_MODES[BLEND_MODES["DST_ATOP"] = 27] = "DST_ATOP";
    BLEND_MODES[BLEND_MODES["ERASE"] = 26] = "ERASE";
    BLEND_MODES[BLEND_MODES["SUBTRACT"] = 28] = "SUBTRACT";
    BLEND_MODES[BLEND_MODES["XOR"] = 29] = "XOR";
})(BLEND_MODES || (BLEND_MODES = {}));
/**
 * Various webgl draw modes. These can be used to specify which GL drawMode to use
 * under certain situations and renderers.
 *
 * @memberof PIXI
 * @static
 * @name DRAW_MODES
 * @enum {number}
 * @property {number} POINTS
 * @property {number} LINES
 * @property {number} LINE_LOOP
 * @property {number} LINE_STRIP
 * @property {number} TRIANGLES
 * @property {number} TRIANGLE_STRIP
 * @property {number} TRIANGLE_FAN
 */
var DRAW_MODES;
(function (DRAW_MODES) {
    DRAW_MODES[DRAW_MODES["POINTS"] = 0] = "POINTS";
    DRAW_MODES[DRAW_MODES["LINES"] = 1] = "LINES";
    DRAW_MODES[DRAW_MODES["LINE_LOOP"] = 2] = "LINE_LOOP";
    DRAW_MODES[DRAW_MODES["LINE_STRIP"] = 3] = "LINE_STRIP";
    DRAW_MODES[DRAW_MODES["TRIANGLES"] = 4] = "TRIANGLES";
    DRAW_MODES[DRAW_MODES["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    DRAW_MODES[DRAW_MODES["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(DRAW_MODES || (DRAW_MODES = {}));
/**
 * Various GL texture/resources formats.
 *
 * @memberof PIXI
 * @static
 * @name FORMATS
 * @enum {number}
 * @property {number} RGBA=6408
 * @property {number} RGB=6407
 * @property {number} RG=33319
 * @property {number} RED=6403
 * @property {number} RGBA_INTEGER=36249
 * @property {number} RGB_INTEGER=36248
 * @property {number} RG_INTEGER=33320
 * @property {number} RED_INTEGER=36244
 * @property {number} ALPHA=6406
 * @property {number} LUMINANCE=6409
 * @property {number} LUMINANCE_ALPHA=6410
 * @property {number} DEPTH_COMPONENT=6402
 * @property {number} DEPTH_STENCIL=34041
 */
var FORMATS;
(function (FORMATS) {
    FORMATS[FORMATS["RGBA"] = 6408] = "RGBA";
    FORMATS[FORMATS["RGB"] = 6407] = "RGB";
    FORMATS[FORMATS["RG"] = 33319] = "RG";
    FORMATS[FORMATS["RED"] = 6403] = "RED";
    FORMATS[FORMATS["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
    FORMATS[FORMATS["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
    FORMATS[FORMATS["RG_INTEGER"] = 33320] = "RG_INTEGER";
    FORMATS[FORMATS["RED_INTEGER"] = 36244] = "RED_INTEGER";
    FORMATS[FORMATS["ALPHA"] = 6406] = "ALPHA";
    FORMATS[FORMATS["LUMINANCE"] = 6409] = "LUMINANCE";
    FORMATS[FORMATS["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
    FORMATS[FORMATS["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
    FORMATS[FORMATS["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
})(FORMATS || (FORMATS = {}));
/**
 * Various GL target types.
 *
 * @memberof PIXI
 * @static
 * @name TARGETS
 * @enum {number}
 * @property {number} TEXTURE_2D=3553
 * @property {number} TEXTURE_CUBE_MAP=34067
 * @property {number} TEXTURE_2D_ARRAY=35866
 * @property {number} TEXTURE_CUBE_MAP_POSITIVE_X=34069
 * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_X=34070
 * @property {number} TEXTURE_CUBE_MAP_POSITIVE_Y=34071
 * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_Y=34072
 * @property {number} TEXTURE_CUBE_MAP_POSITIVE_Z=34073
 * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_Z=34074
 */
var TARGETS;
(function (TARGETS) {
    TARGETS[TARGETS["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
    TARGETS[TARGETS["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
    TARGETS[TARGETS["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
    TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
    TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
    TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
    TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
    TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
    TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(TARGETS || (TARGETS = {}));
/**
 * Various GL data format types.
 *
 * @memberof PIXI
 * @static
 * @name TYPES
 * @enum {number}
 * @property {number} UNSIGNED_BYTE=5121
 * @property {number} UNSIGNED_SHORT=5123
 * @property {number} UNSIGNED_SHORT_5_6_5=33635
 * @property {number} UNSIGNED_SHORT_4_4_4_4=32819
 * @property {number} UNSIGNED_SHORT_5_5_5_1=32820
 * @property {number} UNSIGNED_INT=5125
 * @property {number} UNSIGNED_INT_10F_11F_11F_REV=35899
 * @property {number} UNSIGNED_INT_2_10_10_10_REV=33640
 * @property {number} UNSIGNED_INT_24_8=34042
 * @property {number} UNSIGNED_INT_5_9_9_9_REV=35902
 * @property {number} BYTE=5120
 * @property {number} SHORT=5122
 * @property {number} INT=5124
 * @property {number} FLOAT=5126
 * @property {number} FLOAT_32_UNSIGNED_INT_24_8_REV=36269
 * @property {number} HALF_FLOAT=36193
 */
var TYPES;
(function (TYPES) {
    TYPES[TYPES["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    TYPES[TYPES["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    TYPES[TYPES["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
    TYPES[TYPES["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
    TYPES[TYPES["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
    TYPES[TYPES["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    TYPES[TYPES["UNSIGNED_INT_10F_11F_11F_REV"] = 35899] = "UNSIGNED_INT_10F_11F_11F_REV";
    TYPES[TYPES["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
    TYPES[TYPES["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
    TYPES[TYPES["UNSIGNED_INT_5_9_9_9_REV"] = 35902] = "UNSIGNED_INT_5_9_9_9_REV";
    TYPES[TYPES["BYTE"] = 5120] = "BYTE";
    TYPES[TYPES["SHORT"] = 5122] = "SHORT";
    TYPES[TYPES["INT"] = 5124] = "INT";
    TYPES[TYPES["FLOAT"] = 5126] = "FLOAT";
    TYPES[TYPES["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
    TYPES[TYPES["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
})(TYPES || (TYPES = {}));
/**
 * Various sampler types. Correspond to `sampler`, `isampler`, `usampler` GLSL types respectively.
 * WebGL1 works only with FLOAT.
 *
 * @memberof PIXI
 * @static
 * @name SAMPLER_TYPES
 * @enum {number}
 * @property {number} FLOAT=0
 * @property {number} INT=1
 * @property {number} UINT=2
 */
var SAMPLER_TYPES;
(function (SAMPLER_TYPES) {
    SAMPLER_TYPES[SAMPLER_TYPES["FLOAT"] = 0] = "FLOAT";
    SAMPLER_TYPES[SAMPLER_TYPES["INT"] = 1] = "INT";
    SAMPLER_TYPES[SAMPLER_TYPES["UINT"] = 2] = "UINT";
})(SAMPLER_TYPES || (SAMPLER_TYPES = {}));
/**
 * The scale modes that are supported by pixi.
 *
 * The {@link PIXI.settings.SCALE_MODE} scale mode affects the default scaling mode of future operations.
 * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
 *
 * @memberof PIXI
 * @static
 * @name SCALE_MODES
 * @enum {number}
 * @property {number} LINEAR Smooth scaling
 * @property {number} NEAREST Pixelating scaling
 */
var SCALE_MODES;
(function (SCALE_MODES) {
    SCALE_MODES[SCALE_MODES["NEAREST"] = 0] = "NEAREST";
    SCALE_MODES[SCALE_MODES["LINEAR"] = 1] = "LINEAR";
})(SCALE_MODES || (SCALE_MODES = {}));
/**
 * The wrap modes that are supported by pixi.
 *
 * The {@link PIXI.settings.WRAP_MODE} wrap mode affects the default wrapping mode of future operations.
 * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
 * If the texture is non power of two then clamp will be used regardless as WebGL can
 * only use REPEAT if the texture is po2.
 *
 * This property only affects WebGL.
 *
 * @name WRAP_MODES
 * @memberof PIXI
 * @static
 * @enum {number}
 * @property {number} CLAMP - The textures uvs are clamped
 * @property {number} REPEAT - The texture uvs tile and repeat
 * @property {number} MIRRORED_REPEAT - The texture uvs tile and repeat with mirroring
 */
var WRAP_MODES;
(function (WRAP_MODES) {
    WRAP_MODES[WRAP_MODES["CLAMP"] = 33071] = "CLAMP";
    WRAP_MODES[WRAP_MODES["REPEAT"] = 10497] = "REPEAT";
    WRAP_MODES[WRAP_MODES["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(WRAP_MODES || (WRAP_MODES = {}));
/**
 * Mipmap filtering modes that are supported by pixi.
 *
 * The {@link PIXI.settings.MIPMAP_TEXTURES} affects default texture filtering.
 * Mipmaps are generated for a baseTexture if its `mipmap` field is `ON`,
 * or its `POW2` and texture dimensions are powers of 2.
 * Due to platform restriction, `ON` option will work like `POW2` for webgl-1.
 *
 * This property only affects WebGL.
 *
 * @name MIPMAP_MODES
 * @memberof PIXI
 * @static
 * @enum {number}
 * @property {number} OFF - No mipmaps
 * @property {number} POW2 - Generate mipmaps if texture dimensions are pow2
 * @property {number} ON - Always generate mipmaps
 * @property {number} ON_MANUAL - Use mipmaps, but do not auto-generate them; this is used with a resource
 *   that supports buffering each level-of-detail.
 */
var MIPMAP_MODES;
(function (MIPMAP_MODES) {
    MIPMAP_MODES[MIPMAP_MODES["OFF"] = 0] = "OFF";
    MIPMAP_MODES[MIPMAP_MODES["POW2"] = 1] = "POW2";
    MIPMAP_MODES[MIPMAP_MODES["ON"] = 2] = "ON";
    MIPMAP_MODES[MIPMAP_MODES["ON_MANUAL"] = 3] = "ON_MANUAL";
})(MIPMAP_MODES || (MIPMAP_MODES = {}));
/**
 * How to treat textures with premultiplied alpha
 *
 * @name ALPHA_MODES
 * @memberof PIXI
 * @static
 * @enum {number}
 * @property {number} NO_PREMULTIPLIED_ALPHA - Source is not premultiplied, leave it like that.
 *  Option for compressed and data textures that are created from typed arrays.
 * @property {number} PREMULTIPLY_ON_UPLOAD - Source is not premultiplied, premultiply on upload.
 *  Default option, used for all loaded images.
 * @property {number} PREMULTIPLIED_ALPHA - Source is already premultiplied
 *  Example: spine atlases with `_pma` suffix.
 * @property {number} NPM - Alias for NO_PREMULTIPLIED_ALPHA.
 * @property {number} UNPACK - Default option, alias for PREMULTIPLY_ON_UPLOAD.
 * @property {number} PMA - Alias for PREMULTIPLIED_ALPHA.
 */
var ALPHA_MODES;
(function (ALPHA_MODES) {
    ALPHA_MODES[ALPHA_MODES["NPM"] = 0] = "NPM";
    ALPHA_MODES[ALPHA_MODES["UNPACK"] = 1] = "UNPACK";
    ALPHA_MODES[ALPHA_MODES["PMA"] = 2] = "PMA";
    ALPHA_MODES[ALPHA_MODES["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
    ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
    ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
})(ALPHA_MODES || (ALPHA_MODES = {}));
/**
 * Configure whether filter textures are cleared after binding.
 *
 * Filter textures need not be cleared if the filter does not use pixel blending. {@link CLEAR_MODES.BLIT} will detect
 * this and skip clearing as an optimization.
 *
 * @name CLEAR_MODES
 * @memberof PIXI
 * @static
 * @enum {number}
 * @property {number} BLEND - Do not clear the filter texture. The filter's output will blend on top of the output texture.
 * @property {number} CLEAR - Always clear the filter texture.
 * @property {number} BLIT - Clear only if {@link FilterSystem.forceClear} is set or if the filter uses pixel blending.
 * @property {number} NO - Alias for BLEND, same as `false` in earlier versions
 * @property {number} YES - Alias for CLEAR, same as `true` in earlier versions
 * @property {number} AUTO - Alias for BLIT
 */
var CLEAR_MODES;
(function (CLEAR_MODES) {
    CLEAR_MODES[CLEAR_MODES["NO"] = 0] = "NO";
    CLEAR_MODES[CLEAR_MODES["YES"] = 1] = "YES";
    CLEAR_MODES[CLEAR_MODES["AUTO"] = 2] = "AUTO";
    CLEAR_MODES[CLEAR_MODES["BLEND"] = 0] = "BLEND";
    CLEAR_MODES[CLEAR_MODES["CLEAR"] = 1] = "CLEAR";
    CLEAR_MODES[CLEAR_MODES["BLIT"] = 2] = "BLIT";
})(CLEAR_MODES || (CLEAR_MODES = {}));
/**
 * The gc modes that are supported by pixi.
 *
 * The {@link PIXI.settings.GC_MODE} Garbage Collection mode for PixiJS textures is AUTO
 * If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
 * used for a specified period of time they will be removed from the GPU. They will of course
 * be uploaded again when they are required. This is a silent behind the scenes process that
 * should ensure that the GPU does not  get filled up.
 *
 * Handy for mobile devices!
 * This property only affects WebGL.
 *
 * @name GC_MODES
 * @enum {number}
 * @static
 * @memberof PIXI
 * @property {number} AUTO - Garbage collection will happen periodically automatically
 * @property {number} MANUAL - Garbage collection will need to be called manually
 */
var GC_MODES;
(function (GC_MODES) {
    GC_MODES[GC_MODES["AUTO"] = 0] = "AUTO";
    GC_MODES[GC_MODES["MANUAL"] = 1] = "MANUAL";
})(GC_MODES || (GC_MODES = {}));
/**
 * Constants that specify float precision in shaders.
 *
 * @name PRECISION
 * @memberof PIXI
 * @constant
 * @static
 * @enum {string}
 * @property {string} LOW='lowp'
 * @property {string} MEDIUM='mediump'
 * @property {string} HIGH='highp'
 */
var PRECISION;
(function (PRECISION) {
    PRECISION["LOW"] = "lowp";
    PRECISION["MEDIUM"] = "mediump";
    PRECISION["HIGH"] = "highp";
})(PRECISION || (PRECISION = {}));
/**
 * Constants for mask implementations.
 * We use `type` suffix because it leads to very different behaviours
 *
 * @name MASK_TYPES
 * @memberof PIXI
 * @static
 * @enum {number}
 * @property {number} NONE - Mask is ignored
 * @property {number} SCISSOR - Scissor mask, rectangle on screen, cheap
 * @property {number} STENCIL - Stencil mask, 1-bit, medium, works only if renderer supports stencil
 * @property {number} SPRITE - Mask that uses SpriteMaskFilter, uses temporary RenderTexture
 */
var MASK_TYPES;
(function (MASK_TYPES) {
    MASK_TYPES[MASK_TYPES["NONE"] = 0] = "NONE";
    MASK_TYPES[MASK_TYPES["SCISSOR"] = 1] = "SCISSOR";
    MASK_TYPES[MASK_TYPES["STENCIL"] = 2] = "STENCIL";
    MASK_TYPES[MASK_TYPES["SPRITE"] = 3] = "SPRITE";
})(MASK_TYPES || (MASK_TYPES = {}));
/**
 * Constants for multi-sampling antialiasing.
 *
 * @see PIXI.Framebuffer#multisample
 *
 * @name MSAA_QUALITY
 * @memberof PIXI
 * @static
 * @enum {number}
 * @property {number} NONE - No multisampling for this renderTexture
 * @property {number} LOW - Try 2 samples
 * @property {number} MEDIUM - Try 4 samples
 * @property {number} HIGH - Try 8 samples
 */
var MSAA_QUALITY;
(function (MSAA_QUALITY) {
    MSAA_QUALITY[MSAA_QUALITY["NONE"] = 0] = "NONE";
    MSAA_QUALITY[MSAA_QUALITY["LOW"] = 2] = "LOW";
    MSAA_QUALITY[MSAA_QUALITY["MEDIUM"] = 4] = "MEDIUM";
    MSAA_QUALITY[MSAA_QUALITY["HIGH"] = 8] = "HIGH";
})(MSAA_QUALITY || (MSAA_QUALITY = {}));
/**
 * Constants for various buffer types in Pixi
 *
 * @see PIXI.BUFFER_TYPE
 *
 * @name BUFFER_TYPE
 * @memberof PIXI
 * @static
 * @enum {number}
 * @property {number} ELEMENT_ARRAY_BUFFER - buffer type for using as an index buffer
 * @property {number} ARRAY_BUFFER - buffer type for using attribute data
 * @property {number} UNIFORM_BUFFER - the buffer type is for uniform buffer objects
 */
var BUFFER_TYPE;
(function (BUFFER_TYPE) {
    BUFFER_TYPE[BUFFER_TYPE["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
    BUFFER_TYPE[BUFFER_TYPE["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
    // NOT YET SUPPORTED
    BUFFER_TYPE[BUFFER_TYPE["UNIFORM_BUFFER"] = 35345] = "UNIFORM_BUFFER";
})(BUFFER_TYPE || (BUFFER_TYPE = {}));

/**
 * User's customizable globals for overriding the default PIXI settings, such
 * as a renderer's default resolution, framerate, float precision, etc.
 * @example
 * // Use the native window resolution as the default resolution
 * // will support high-density displays when rendering
 * PIXI.settings.RESOLUTION = window.devicePixelRatio;
 *
 * // Disable interpolation when scaling, will make texture be pixelated
 * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
 * @namespace PIXI.settings
 */
var settings = {
    /**
     * If set to true WebGL will attempt make textures mimpaped by default.
     * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
     *
     * @static
     * @name MIPMAP_TEXTURES
     * @memberof PIXI.settings
     * @type {PIXI.MIPMAP_MODES}
     * @default PIXI.MIPMAP_MODES.POW2
     */
    MIPMAP_TEXTURES: MIPMAP_MODES.POW2,
    /**
     * Default anisotropic filtering level of textures.
     * Usually from 0 to 16
     *
     * @static
     * @name ANISOTROPIC_LEVEL
     * @memberof PIXI.settings
     * @type {number}
     * @default 0
     */
    ANISOTROPIC_LEVEL: 0,
    /**
     * Default resolution / device pixel ratio of the renderer.
     *
     * @static
     * @name RESOLUTION
     * @memberof PIXI.settings
     * @type {number}
     * @default 1
     */
    RESOLUTION: 1,
    /**
     * Default filter resolution.
     *
     * @static
     * @name FILTER_RESOLUTION
     * @memberof PIXI.settings
     * @type {number}
     * @default 1
     */
    FILTER_RESOLUTION: 1,
    /**
     * Default filter samples.
     *
     * @static
     * @name FILTER_MULTISAMPLE
     * @memberof PIXI.settings
     * @type {PIXI.MSAA_QUALITY}
     * @default PIXI.MSAA_QUALITY.NONE
     */
    FILTER_MULTISAMPLE: MSAA_QUALITY.NONE,
    /**
     * The maximum textures that this device supports.
     *
     * @static
     * @name SPRITE_MAX_TEXTURES
     * @memberof PIXI.settings
     * @type {number}
     * @default 32
     */
    SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),
    // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
    // TODO: maybe add PARTICLE.BATCH_SIZE: 15000
    /**
     * The default sprite batch size.
     *
     * The default aims to balance desktop and mobile devices.
     *
     * @static
     * @name SPRITE_BATCH_SIZE
     * @memberof PIXI.settings
     * @type {number}
     * @default 4096
     */
    SPRITE_BATCH_SIZE: 4096,
    /**
     * The default render options if none are supplied to {@link PIXI.Renderer}
     * or {@link PIXI.CanvasRenderer}.
     *
     * @static
     * @name RENDER_OPTIONS
     * @memberof PIXI.settings
     * @type {object}
     * @property {HTMLCanvasElement} view=null
     * @property {boolean} antialias=false
     * @property {boolean} autoDensity=false
     * @property {boolean} useContextAlpha=true
     * @property {number} backgroundColor=0x000000
     * @property {number} backgroundAlpha=1
     * @property {boolean} clearBeforeRender=true
     * @property {boolean} preserveDrawingBuffer=false
     * @property {number} width=800
     * @property {number} height=600
     * @property {boolean} legacy=false
     */
    RENDER_OPTIONS: {
        view: null,
        antialias: false,
        autoDensity: false,
        backgroundColor: 0x000000,
        backgroundAlpha: 1,
        useContextAlpha: true,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        width: 800,
        height: 600,
        legacy: false,
    },
    /**
     * Default Garbage Collection mode.
     *
     * @static
     * @name GC_MODE
     * @memberof PIXI.settings
     * @type {PIXI.GC_MODES}
     * @default PIXI.GC_MODES.AUTO
     */
    GC_MODE: GC_MODES.AUTO,
    /**
     * Default Garbage Collection max idle.
     *
     * @static
     * @name GC_MAX_IDLE
     * @memberof PIXI.settings
     * @type {number}
     * @default 3600
     */
    GC_MAX_IDLE: 60 * 60,
    /**
     * Default Garbage Collection maximum check count.
     *
     * @static
     * @name GC_MAX_CHECK_COUNT
     * @memberof PIXI.settings
     * @type {number}
     * @default 600
     */
    GC_MAX_CHECK_COUNT: 60 * 10,
    /**
     * Default wrap modes that are supported by pixi.
     *
     * @static
     * @name WRAP_MODE
     * @memberof PIXI.settings
     * @type {PIXI.WRAP_MODES}
     * @default PIXI.WRAP_MODES.CLAMP
     */
    WRAP_MODE: WRAP_MODES.CLAMP,
    /**
     * Default scale mode for textures.
     *
     * @static
     * @name SCALE_MODE
     * @memberof PIXI.settings
     * @type {PIXI.SCALE_MODES}
     * @default PIXI.SCALE_MODES.LINEAR
     */
    SCALE_MODE: SCALE_MODES.LINEAR,
    /**
     * Default specify float precision in vertex shader.
     *
     * @static
     * @name PRECISION_VERTEX
     * @memberof PIXI.settings
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.HIGH
     */
    PRECISION_VERTEX: PRECISION.HIGH,
    /**
     * Default specify float precision in fragment shader.
     * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
     *
     * @static
     * @name PRECISION_FRAGMENT
     * @memberof PIXI.settings
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.MEDIUM
     */
    PRECISION_FRAGMENT: isMobile.apple.device ? PRECISION.HIGH : PRECISION.MEDIUM,
    /**
     * Can we upload the same buffer in a single frame?
     *
     * @static
     * @name CAN_UPLOAD_SAME_BUFFER
     * @memberof PIXI.settings
     * @type {boolean}
     */
    CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),
    /**
     * Enables bitmap creation before image load. This feature is experimental.
     *
     * @static
     * @name CREATE_IMAGE_BITMAP
     * @memberof PIXI.settings
     * @type {boolean}
     * @default false
     */
    CREATE_IMAGE_BITMAP: false,
    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     *
     * @static
     * @constant
     * @memberof PIXI.settings
     * @type {boolean}
     * @default false
     */
    ROUND_PIXELS: false,
};

/*!
 * @pixi/ticker - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/ticker is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * Target frames per millisecond.
 *
 * @static
 * @name TARGET_FPMS
 * @memberof PIXI.settings
 * @type {number}
 * @default 0.06
 */
settings.TARGET_FPMS = 0.06;

/**
 * Represents the update priorities used by internal PIXI classes when registered with
 * the {@link PIXI.Ticker} object. Higher priority items are updated first and lower
 * priority items, such as render, should go later.
 *
 * @static
 * @constant
 * @name UPDATE_PRIORITY
 * @memberof PIXI
 * @enum {number}
 * @property {number} INTERACTION=50 Highest priority, used for {@link PIXI.InteractionManager}
 * @property {number} HIGH=25 High priority updating, {@link PIXI.VideoBaseTexture} and {@link PIXI.AnimatedSprite}
 * @property {number} NORMAL=0 Default priority for ticker events, see {@link PIXI.Ticker#add}.
 * @property {number} LOW=-25 Low priority used for {@link PIXI.Application} rendering.
 * @property {number} UTILITY=-50 Lowest priority used for {@link PIXI.BasePrepare} utility.
 */
var UPDATE_PRIORITY;
(function (UPDATE_PRIORITY) {
    UPDATE_PRIORITY[UPDATE_PRIORITY["INTERACTION"] = 50] = "INTERACTION";
    UPDATE_PRIORITY[UPDATE_PRIORITY["HIGH"] = 25] = "HIGH";
    UPDATE_PRIORITY[UPDATE_PRIORITY["NORMAL"] = 0] = "NORMAL";
    UPDATE_PRIORITY[UPDATE_PRIORITY["LOW"] = -25] = "LOW";
    UPDATE_PRIORITY[UPDATE_PRIORITY["UTILITY"] = -50] = "UTILITY";
})(UPDATE_PRIORITY || (UPDATE_PRIORITY = {}));

/**
 * Internal class for handling the priority sorting of ticker handlers.
 *
 * @private
 * @class
 * @memberof PIXI
 */
var TickerListener = /** @class */ (function () {
    /**
     * Constructor
     * @private
     * @param fn - The listener function to be added for one update
     * @param context - The listener context
     * @param priority - The priority for emitting
     * @param once - If the handler should fire once
     */
    function TickerListener(fn, context, priority, once) {
        if (context === void 0) { context = null; }
        if (priority === void 0) { priority = 0; }
        if (once === void 0) { once = false; }
        /** The next item in chain. */
        this.next = null;
        /** The previous item in chain. */
        this.previous = null;
        /** `true` if this listener has been destroyed already. */
        this._destroyed = false;
        this.fn = fn;
        this.context = context;
        this.priority = priority;
        this.once = once;
    }
    /**
     * Simple compare function to figure out if a function and context match.
     * @private
     * @param fn - The listener function to be added for one update
     * @param context - The listener context
     * @return `true` if the listener match the arguments
     */
    TickerListener.prototype.match = function (fn, context) {
        if (context === void 0) { context = null; }
        return this.fn === fn && this.context === context;
    };
    /**
     * Emit by calling the current function.
     * @private
     * @param deltaTime - time since the last emit.
     * @return Next ticker
     */
    TickerListener.prototype.emit = function (deltaTime) {
        if (this.fn) {
            if (this.context) {
                this.fn.call(this.context, deltaTime);
            }
            else {
                this.fn(deltaTime);
            }
        }
        var redirect = this.next;
        if (this.once) {
            this.destroy(true);
        }
        // Soft-destroying should remove
        // the next reference
        if (this._destroyed) {
            this.next = null;
        }
        return redirect;
    };
    /**
     * Connect to the list.
     * @private
     * @param previous - Input node, previous listener
     */
    TickerListener.prototype.connect = function (previous) {
        this.previous = previous;
        if (previous.next) {
            previous.next.previous = this;
        }
        this.next = previous.next;
        previous.next = this;
    };
    /**
     * Destroy and don't use after this.
     * @private
     * @param hard - `true` to remove the `next` reference, this
     *        is considered a hard destroy. Soft destroy maintains the next reference.
     * @return The listener to redirect while emitting or removing.
     */
    TickerListener.prototype.destroy = function (hard) {
        if (hard === void 0) { hard = false; }
        this._destroyed = true;
        this.fn = null;
        this.context = null;
        // Disconnect, hook up next and previous
        if (this.previous) {
            this.previous.next = this.next;
        }
        if (this.next) {
            this.next.previous = this.previous;
        }
        // Redirect to the next item
        var redirect = this.next;
        // Remove references
        this.next = hard ? null : redirect;
        this.previous = null;
        return redirect;
    };
    return TickerListener;
}());

/**
 * A Ticker class that runs an update loop that other objects listen to.
 *
 * This class is composed around listeners meant for execution on the next requested animation frame.
 * Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.
 *
 * @class
 * @memberof PIXI
 */
var Ticker = /** @class */ (function () {
    function Ticker() {
        var _this = this;
        /**
         * Whether or not this ticker should invoke the method
         * {@link PIXI.Ticker#start} automatically
         * when a listener is added.
         */
        this.autoStart = false;
        /**
         * Scalar time value from last frame to this frame.
         * This value is capped by setting {@link PIXI.Ticker#minFPS}
         * and is scaled with {@link PIXI.Ticker#speed}.
         * **Note:** The cap may be exceeded by scaling.
         */
        this.deltaTime = 1;
        /**
         * The last time {@link PIXI.Ticker#update} was invoked.
         * This value is also reset internally outside of invoking
         * update, but only when a new animation frame is requested.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         */
        this.lastTime = -1;
        /**
         * Factor of current {@link PIXI.Ticker#deltaTime}.
         * @example
         * // Scales ticker.deltaTime to what would be
         * // the equivalent of approximately 120 FPS
         * ticker.speed = 2;
         */
        this.speed = 1;
        /**
         * Whether or not this ticker has been started.
         * `true` if {@link PIXI.Ticker#start} has been called.
         * `false` if {@link PIXI.Ticker#stop} has been called.
         * While `false`, this value may change to `true` in the
         * event of {@link PIXI.Ticker#autoStart} being `true`
         * and a listener is added.
         */
        this.started = false;
        /** Internal current frame request ID */
        this._requestId = null;
        /**
         * Internal value managed by minFPS property setter and getter.
         * This is the maximum allowed milliseconds between updates.
         */
        this._maxElapsedMS = 100;
        /**
         * Internal value managed by minFPS property setter and getter.
         * This is the maximum allowed milliseconds between updates.
         */
        this._minElapsedMS = 0;
        /** If enabled, deleting is disabled.*/
        this._protected = false;
        /**
         * The last time keyframe was executed.
         * Maintains a relatively fixed interval with the previous value.
         */
        this._lastFrame = -1;
        this._head = new TickerListener(null, null, Infinity);
        this.deltaMS = 1 / settings.TARGET_FPMS;
        this.elapsedMS = 1 / settings.TARGET_FPMS;
        this._tick = function (time) {
            _this._requestId = null;
            if (_this.started) {
                // Invoke listeners now
                _this.update(time);
                // Listener side effects may have modified ticker state.
                if (_this.started && _this._requestId === null && _this._head.next) {
                    _this._requestId = requestAnimationFrame(_this._tick);
                }
            }
        };
    }
    /**
     * Conditionally requests a new animation frame.
     * If a frame has not already been requested, and if the internal
     * emitter has listeners, a new frame is requested.
     *
     * @private
     */
    Ticker.prototype._requestIfNeeded = function () {
        if (this._requestId === null && this._head.next) {
            // ensure callbacks get correct delta
            this.lastTime = performance.now();
            this._lastFrame = this.lastTime;
            this._requestId = requestAnimationFrame(this._tick);
        }
    };
    /**
     * Conditionally cancels a pending animation frame.
     * @private
     */
    Ticker.prototype._cancelIfNeeded = function () {
        if (this._requestId !== null) {
            cancelAnimationFrame(this._requestId);
            this._requestId = null;
        }
    };
    /**
     * Conditionally requests a new animation frame.
     * If the ticker has been started it checks if a frame has not already
     * been requested, and if the internal emitter has listeners. If these
     * conditions are met, a new frame is requested. If the ticker has not
     * been started, but autoStart is `true`, then the ticker starts now,
     * and continues with the previous conditions to request a new frame.
     *
     * @private
     */
    Ticker.prototype._startIfPossible = function () {
        if (this.started) {
            this._requestIfNeeded();
        }
        else if (this.autoStart) {
            this.start();
        }
    };
    /**
     * Register a handler for tick events. Calls continuously unless
     * it is removed or the ticker is stopped.
     *
     * @param fn - The listener function to be added for updates
     * @param context - The listener context
     * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
     * @returns This instance of a ticker
     */
    Ticker.prototype.add = function (fn, context, priority) {
        if (priority === void 0) { priority = UPDATE_PRIORITY.NORMAL; }
        return this._addListener(new TickerListener(fn, context, priority));
    };
    /**
     * Add a handler for the tick event which is only execute once.
     *
     * @param fn - The listener function to be added for one update
     * @param context - The listener context
     * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
     * @returns This instance of a ticker
     */
    Ticker.prototype.addOnce = function (fn, context, priority) {
        if (priority === void 0) { priority = UPDATE_PRIORITY.NORMAL; }
        return this._addListener(new TickerListener(fn, context, priority, true));
    };
    /**
     * Internally adds the event handler so that it can be sorted by priority.
     * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
     * before the rendering.
     *
     * @private
     * @param listener - Current listener being added.
     * @returns This instance of a ticker
     */
    Ticker.prototype._addListener = function (listener) {
        // For attaching to head
        var current = this._head.next;
        var previous = this._head;
        // Add the first item
        if (!current) {
            listener.connect(previous);
        }
        else {
            // Go from highest to lowest priority
            while (current) {
                if (listener.priority > current.priority) {
                    listener.connect(previous);
                    break;
                }
                previous = current;
                current = current.next;
            }
            // Not yet connected
            if (!listener.previous) {
                listener.connect(previous);
            }
        }
        this._startIfPossible();
        return this;
    };
    /**
     * Removes any handlers matching the function and context parameters.
     * If no handlers are left after removing, then it cancels the animation frame.
     *
     * @param fn - The listener function to be removed
     * @param context - The listener context to be removed
     * @returns This instance of a ticker
     */
    Ticker.prototype.remove = function (fn, context) {
        var listener = this._head.next;
        while (listener) {
            // We found a match, lets remove it
            // no break to delete all possible matches
            // incase a listener was added 2+ times
            if (listener.match(fn, context)) {
                listener = listener.destroy();
            }
            else {
                listener = listener.next;
            }
        }
        if (!this._head.next) {
            this._cancelIfNeeded();
        }
        return this;
    };
    Object.defineProperty(Ticker.prototype, "count", {
        /**
         * The number of listeners on this ticker, calculated by walking through linked list
         *
         * @readonly
         * @member {number}
         */
        get: function () {
            if (!this._head) {
                return 0;
            }
            var count = 0;
            var current = this._head;
            while ((current = current.next)) {
                count++;
            }
            return count;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Starts the ticker. If the ticker has listeners
     * a new animation frame is requested at this point.
     */
    Ticker.prototype.start = function () {
        if (!this.started) {
            this.started = true;
            this._requestIfNeeded();
        }
    };
    /**
     * Stops the ticker. If the ticker has requested
     * an animation frame it is canceled at this point.
     */
    Ticker.prototype.stop = function () {
        if (this.started) {
            this.started = false;
            this._cancelIfNeeded();
        }
    };
    /**
     * Destroy the ticker and don't use after this. Calling
     * this method removes all references to internal events.
     */
    Ticker.prototype.destroy = function () {
        if (!this._protected) {
            this.stop();
            var listener = this._head.next;
            while (listener) {
                listener = listener.destroy(true);
            }
            this._head.destroy();
            this._head = null;
        }
    };
    /**
     * Triggers an update. An update entails setting the
     * current {@link PIXI.Ticker#elapsedMS},
     * the current {@link PIXI.Ticker#deltaTime},
     * invoking all listeners with current deltaTime,
     * and then finally setting {@link PIXI.Ticker#lastTime}
     * with the value of currentTime that was provided.
     * This method will be called automatically by animation
     * frame callbacks if the ticker instance has been started
     * and listeners are added.
     *
     * @param {number} [currentTime=performance.now()] - the current time of execution
     */
    Ticker.prototype.update = function (currentTime) {
        if (currentTime === void 0) { currentTime = performance.now(); }
        var elapsedMS;
        // If the difference in time is zero or negative, we ignore most of the work done here.
        // If there is no valid difference, then should be no reason to let anyone know about it.
        // A zero delta, is exactly that, nothing should update.
        //
        // The difference in time can be negative, and no this does not mean time traveling.
        // This can be the result of a race condition between when an animation frame is requested
        // on the current JavaScript engine event loop, and when the ticker's start method is invoked
        // (which invokes the internal _requestIfNeeded method). If a frame is requested before
        // _requestIfNeeded is invoked, then the callback for the animation frame the ticker requests,
        // can receive a time argument that can be less than the lastTime value that was set within
        // _requestIfNeeded. This difference is in microseconds, but this is enough to cause problems.
        //
        // This check covers this browser engine timing issue, as well as if consumers pass an invalid
        // currentTime value. This may happen if consumers opt-out of the autoStart, and update themselves.
        if (currentTime > this.lastTime) {
            // Save uncapped elapsedMS for measurement
            elapsedMS = this.elapsedMS = currentTime - this.lastTime;
            // cap the milliseconds elapsed used for deltaTime
            if (elapsedMS > this._maxElapsedMS) {
                elapsedMS = this._maxElapsedMS;
            }
            elapsedMS *= this.speed;
            // If not enough time has passed, exit the function.
            // Get ready for next frame by setting _lastFrame, but based on _minElapsedMS
            // adjustment to ensure a relatively stable interval.
            if (this._minElapsedMS) {
                var delta = currentTime - this._lastFrame | 0;
                if (delta < this._minElapsedMS) {
                    return;
                }
                this._lastFrame = currentTime - (delta % this._minElapsedMS);
            }
            this.deltaMS = elapsedMS;
            this.deltaTime = this.deltaMS * settings.TARGET_FPMS;
            // Cache a local reference, in-case ticker is destroyed
            // during the emit, we can still check for head.next
            var head = this._head;
            // Invoke listeners added to internal emitter
            var listener = head.next;
            while (listener) {
                listener = listener.emit(this.deltaTime);
            }
            if (!head.next) {
                this._cancelIfNeeded();
            }
        }
        else {
            this.deltaTime = this.deltaMS = this.elapsedMS = 0;
        }
        this.lastTime = currentTime;
    };
    Object.defineProperty(Ticker.prototype, "FPS", {
        /**
         * The frames per second at which this ticker is running.
         * The default is approximately 60 in most modern browsers.
         * **Note:** This does not factor in the value of
         * {@link PIXI.Ticker#speed}, which is specific
         * to scaling {@link PIXI.Ticker#deltaTime}.
         *
         * @member {number}
         * @readonly
         */
        get: function () {
            return 1000 / this.elapsedMS;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ticker.prototype, "minFPS", {
        /**
         * Manages the maximum amount of milliseconds allowed to
         * elapse between invoking {@link PIXI.Ticker#update}.
         * This value is used to cap {@link PIXI.Ticker#deltaTime},
         * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
         * When setting this property it is clamped to a value between
         * `0` and `PIXI.settings.TARGET_FPMS * 1000`.
         *
         * @member {number}
         * @default 10
         */
        get: function () {
            return 1000 / this._maxElapsedMS;
        },
        set: function (fps) {
            // Minimum must be below the maxFPS
            var minFPS = Math.min(this.maxFPS, fps);
            // Must be at least 0, but below 1 / settings.TARGET_FPMS
            var minFPMS = Math.min(Math.max(0, minFPS) / 1000, settings.TARGET_FPMS);
            this._maxElapsedMS = 1 / minFPMS;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ticker.prototype, "maxFPS", {
        /**
         * Manages the minimum amount of milliseconds required to
         * elapse between invoking {@link PIXI.Ticker#update}.
         * This will effect the measured value of {@link PIXI.Ticker#FPS}.
         * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
         * Otherwise it will be at least `minFPS`
         *
         * @member {number}
         * @default 0
         */
        get: function () {
            if (this._minElapsedMS) {
                return Math.round(1000 / this._minElapsedMS);
            }
            return 0;
        },
        set: function (fps) {
            if (fps === 0) {
                this._minElapsedMS = 0;
            }
            else {
                // Max must be at least the minFPS
                var maxFPS = Math.max(this.minFPS, fps);
                this._minElapsedMS = 1 / (maxFPS / 1000);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ticker, "shared", {
        /**
         * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
         * {@link PIXI.VideoResource} to update animation frames / video textures.
         *
         * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
         *
         * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
         * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
         *
         * @example
         * let ticker = PIXI.Ticker.shared;
         * // Set this to prevent starting this ticker when listeners are added.
         * // By default this is true only for the PIXI.Ticker.shared instance.
         * ticker.autoStart = false;
         * // FYI, call this to ensure the ticker is stopped. It should be stopped
         * // if you have not attempted to render anything yet.
         * ticker.stop();
         * // Call this when you are ready for a running shared ticker.
         * ticker.start();
         *
         * @example
         * // You may use the shared ticker to render...
         * let renderer = PIXI.autoDetectRenderer();
         * let stage = new PIXI.Container();
         * document.body.appendChild(renderer.view);
         * ticker.add(function (time) {
         *     renderer.render(stage);
         * });
         *
         * @example
         * // Or you can just update it manually.
         * ticker.autoStart = false;
         * ticker.stop();
         * function animate(time) {
         *     ticker.update(time);
         *     renderer.render(stage);
         *     requestAnimationFrame(animate);
         * }
         * animate(performance.now());
         *
         * @member {PIXI.Ticker}
         * @static
         */
        get: function () {
            if (!Ticker._shared) {
                var shared = Ticker._shared = new Ticker();
                shared.autoStart = true;
                shared._protected = true;
            }
            return Ticker._shared;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ticker, "system", {
        /**
         * The system ticker instance used by {@link PIXI.InteractionManager} and by
         * {@link PIXI.BasePrepare} for core timing functionality that shouldn't usually need to be paused,
         * unlike the `shared` ticker which drives visual animations and rendering which may want to be paused.
         *
         * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
         *
         * @member {PIXI.Ticker}
         * @static
         */
        get: function () {
            if (!Ticker._system) {
                var system = Ticker._system = new Ticker();
                system.autoStart = true;
                system._protected = true;
            }
            return Ticker._system;
        },
        enumerable: false,
        configurable: true
    });
    return Ticker;
}());

/*!
 * @pixi/interaction - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/interaction is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * Holds all information related to an Interaction event
 *
 * @class
 * @memberof PIXI
 */
var InteractionData = /** @class */ (function () {
    function InteractionData() {
        this.pressure = 0;
        this.rotationAngle = 0;
        this.twist = 0;
        this.tangentialPressure = 0;
        /**
         * This point stores the global coords of where the touch/mouse event happened
         *
         * @member {PIXI.Point}
         */
        this.global = new Point();
        /**
         * The target Sprite that was interacted with
         *
         * @member {PIXI.Sprite}
         */
        this.target = null;
        /**
         * When passed to an event handler, this will be the original DOM Event that was captured
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
         * @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
         * @member {MouseEvent|TouchEvent|PointerEvent}
         */
        this.originalEvent = null;
        /**
         * Unique identifier for this interaction
         *
         * @member {number}
         */
        this.identifier = null;
        /**
         * Indicates whether or not the pointer device that created the event is the primary pointer.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary
         * @type {Boolean}
         */
        this.isPrimary = false;
        /**
         * Indicates which button was pressed on the mouse or pointer device to trigger the event.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
         * @type {number}
         */
        this.button = 0;
        /**
         * Indicates which buttons are pressed on the mouse or pointer device when the event is triggered.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
         * @type {number}
         */
        this.buttons = 0;
        /**
         * The width of the pointer's contact along the x-axis, measured in CSS pixels.
         * radiusX of TouchEvents will be represented by this value.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width
         * @type {number}
         */
        this.width = 0;
        /**
         * The height of the pointer's contact along the y-axis, measured in CSS pixels.
         * radiusY of TouchEvents will be represented by this value.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height
         * @type {number}
         */
        this.height = 0;
        /**
         * The angle, in degrees, between the pointer device and the screen.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX
         * @type {number}
         */
        this.tiltX = 0;
        /**
         * The angle, in degrees, between the pointer device and the screen.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY
         * @type {number}
         */
        this.tiltY = 0;
        /**
         * The type of pointer that triggered the event.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
         * @type {string}
         */
        this.pointerType = null;
        /**
         * Pressure applied by the pointing device during the event. A Touch's force property
         * will be represented by this value.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
         * @type {number}
         */
        this.pressure = 0;
        /**
         * From TouchEvents (not PointerEvents triggered by touches), the rotationAngle of the Touch.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Touch/rotationAngle
         * @type {number}
         */
        this.rotationAngle = 0;
        /**
         * Twist of a stylus pointer.
         * @see https://w3c.github.io/pointerevents/#pointerevent-interface
         * @type {number}
         */
        this.twist = 0;
        /**
         * Barrel pressure on a stylus pointer.
         * @see https://w3c.github.io/pointerevents/#pointerevent-interface
         * @type {number}
         */
        this.tangentialPressure = 0;
    }
    Object.defineProperty(InteractionData.prototype, "pointerId", {
        /**
         * The unique identifier of the pointer. It will be the same as `identifier`.
         * @readonly
         * @member {number}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
         */
        get: function () {
            return this.identifier;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * This will return the local coordinates of the specified displayObject for this InteractionData
     *
     * @param {PIXI.DisplayObject} displayObject - The DisplayObject that you would like the local
     *  coords off
     * @param {PIXI.Point} [point] - A Point object in which to store the value, optional (otherwise
     *  will create a new point)
     * @param {PIXI.Point} [globalPos] - A Point object containing your custom global coords, optional
     *  (otherwise will use the current global coords)
     * @return {PIXI.Point} A point containing the coordinates of the InteractionData position relative
     *  to the DisplayObject
     */
    InteractionData.prototype.getLocalPosition = function (displayObject, point, globalPos) {
        return displayObject.worldTransform.applyInverse(globalPos || this.global, point);
    };
    /**
     * Copies properties from normalized event data.
     *
     * @param {Touch|MouseEvent|PointerEvent} event - The normalized event data
     */
    InteractionData.prototype.copyEvent = function (event) {
        // isPrimary should only change on touchstart/pointerdown, so we don't want to overwrite
        // it with "false" on later events when our shim for it on touch events might not be
        // accurate
        if ('isPrimary' in event && event.isPrimary) {
            this.isPrimary = true;
        }
        this.button = 'button' in event && event.button;
        // event.buttons is not available in all browsers (ie. Safari), but it does have a non-standard
        // event.which property instead, which conveys the same information.
        var buttons = 'buttons' in event && event.buttons;
        this.buttons = Number.isInteger(buttons) ? buttons : 'which' in event && event.which;
        this.width = 'width' in event && event.width;
        this.height = 'height' in event && event.height;
        this.tiltX = 'tiltX' in event && event.tiltX;
        this.tiltY = 'tiltY' in event && event.tiltY;
        this.pointerType = 'pointerType' in event && event.pointerType;
        this.pressure = 'pressure' in event && event.pressure;
        this.rotationAngle = 'rotationAngle' in event && event.rotationAngle;
        this.twist = ('twist' in event && event.twist) || 0;
        this.tangentialPressure = ('tangentialPressure' in event && event.tangentialPressure) || 0;
    };
    /**
     * Resets the data for pooling.
     */
    InteractionData.prototype.reset = function () {
        // isPrimary is the only property that we really need to reset - everything else is
        // guaranteed to be overwritten
        this.isPrimary = false;
    };
    return InteractionData;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * Event class that mimics native DOM events.
 *
 * @class
 * @memberof PIXI
 */
var InteractionEvent = /** @class */ (function () {
    function InteractionEvent() {
        /**
         * Whether this event will continue propagating in the tree.
         *
         * Remaining events for the {@link stopsPropagatingAt} object
         * will still be dispatched.
         *
         * @member {boolean}
         */
        this.stopped = false;
        /**
         * At which object this event stops propagating.
         *
         * @private
         * @member {PIXI.DisplayObject}
         */
        this.stopsPropagatingAt = null;
        /**
         * Whether we already reached the element we want to
         * stop propagating at. This is important for delayed events,
         * where we start over deeper in the tree again.
         *
         * @private
         * @member {boolean}
         */
        this.stopPropagationHint = false;
        /**
         * The object which caused this event to be dispatched.
         * For listener callback see {@link PIXI.InteractionEvent.currentTarget}.
         *
         * @member {PIXI.DisplayObject}
         */
        this.target = null;
        /**
         * The object whose event listener’s callback is currently being invoked.
         *
         * @member {PIXI.DisplayObject}
         */
        this.currentTarget = null;
        /**
         * Type of the event
         *
         * @member {string}
         */
        this.type = null;
        /**
         * InteractionData related to this event
         *
         * @member {PIXI.InteractionData}
         */
        this.data = null;
    }
    /**
     * Prevents event from reaching any objects other than the current object.
     *
     */
    InteractionEvent.prototype.stopPropagation = function () {
        this.stopped = true;
        this.stopPropagationHint = true;
        this.stopsPropagatingAt = this.currentTarget;
    };
    /**
     * Resets the event.
     */
    InteractionEvent.prototype.reset = function () {
        this.stopped = false;
        this.stopsPropagatingAt = null;
        this.stopPropagationHint = false;
        this.currentTarget = null;
        this.target = null;
    };
    return InteractionEvent;
}());

/**
 * DisplayObjects with the {@link PIXI.interactiveTarget} mixin use this class to track interactions
 *
 * @class
 * @private
 * @memberof PIXI
 */
var InteractionTrackingData = /** @class */ (function () {
    /**
     * @param {number} pointerId - Unique pointer id of the event
     * @private
     */
    function InteractionTrackingData(pointerId) {
        this._pointerId = pointerId;
        this._flags = InteractionTrackingData.FLAGS.NONE;
    }
    /**
     *
     * @private
     * @param {number} flag - The interaction flag to set
     * @param {boolean} yn - Should the flag be set or unset
     */
    InteractionTrackingData.prototype._doSet = function (flag, yn) {
        if (yn) {
            this._flags = this._flags | flag;
        }
        else {
            this._flags = this._flags & (~flag);
        }
    };
    Object.defineProperty(InteractionTrackingData.prototype, "pointerId", {
        /**
         * Unique pointer id of the event
         *
         * @readonly
         * @private
         * @member {number}
         */
        get: function () {
            return this._pointerId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InteractionTrackingData.prototype, "flags", {
        /**
         * State of the tracking data, expressed as bit flags
         *
         * @private
         * @member {number}
         */
        get: function () {
            return this._flags;
        },
        set: function (flags) {
            this._flags = flags;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InteractionTrackingData.prototype, "none", {
        /**
         * Is the tracked event inactive (not over or down)?
         *
         * @private
         * @member {number}
         */
        get: function () {
            return this._flags === InteractionTrackingData.FLAGS.NONE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InteractionTrackingData.prototype, "over", {
        /**
         * Is the tracked event over the DisplayObject?
         *
         * @private
         * @member {boolean}
         */
        get: function () {
            return (this._flags & InteractionTrackingData.FLAGS.OVER) !== 0;
        },
        set: function (yn) {
            this._doSet(InteractionTrackingData.FLAGS.OVER, yn);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InteractionTrackingData.prototype, "rightDown", {
        /**
         * Did the right mouse button come down in the DisplayObject?
         *
         * @private
         * @member {boolean}
         */
        get: function () {
            return (this._flags & InteractionTrackingData.FLAGS.RIGHT_DOWN) !== 0;
        },
        set: function (yn) {
            this._doSet(InteractionTrackingData.FLAGS.RIGHT_DOWN, yn);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InteractionTrackingData.prototype, "leftDown", {
        /**
         * Did the left mouse button come down in the DisplayObject?
         *
         * @private
         * @member {boolean}
         */
        get: function () {
            return (this._flags & InteractionTrackingData.FLAGS.LEFT_DOWN) !== 0;
        },
        set: function (yn) {
            this._doSet(InteractionTrackingData.FLAGS.LEFT_DOWN, yn);
        },
        enumerable: false,
        configurable: true
    });
    InteractionTrackingData.FLAGS = Object.freeze({
        NONE: 0,
        OVER: 1 << 0,
        LEFT_DOWN: 1 << 1,
        RIGHT_DOWN: 1 << 2,
    });
    return InteractionTrackingData;
}());

/**
 * Strategy how to search through stage tree for interactive objects
 *
 * @private
 * @class
 * @memberof PIXI
 */
var TreeSearch = /** @class */ (function () {
    function TreeSearch() {
        this._tempPoint = new Point();
    }
    /**
     * Recursive implementation for findHit
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - event containing the point that
     *  is tested for collision
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - the displayObject
     *  that will be hit test (recursively crawls its children)
     * @param {Function} [func] - the function that will be called on each interactive object. The
     *  interactionEvent, displayObject and hit will be passed to the function
     * @param {boolean} [hitTest] - this indicates if the objects inside should be hit test against the point
     * @param {boolean} [interactive] - Whether the displayObject is interactive
     * @return {boolean} returns true if the displayObject hit the point
     */
    TreeSearch.prototype.recursiveFindHit = function (interactionEvent, displayObject, func, hitTest, interactive) {
        if (!displayObject || !displayObject.visible) {
            return false;
        }
        var point = interactionEvent.data.global;
        // Took a little while to rework this function correctly! But now it is done and nice and optimized! ^_^
        //
        // This function will now loop through all objects and then only hit test the objects it HAS
        // to, not all of them. MUCH faster..
        // An object will be hit test if the following is true:
        //
        // 1: It is interactive.
        // 2: It belongs to a parent that is interactive AND one of the parents children have not already been hit.
        //
        // As another little optimization once an interactive object has been hit we can carry on
        // through the scenegraph, but we know that there will be no more hits! So we can avoid extra hit tests
        // A final optimization is that an object is not hit test directly if a child has already been hit.
        interactive = displayObject.interactive || interactive;
        var hit = false;
        var interactiveParent = interactive;
        // Flag here can set to false if the event is outside the parents hitArea or mask
        var hitTestChildren = true;
        // If there is a hitArea, no need to test against anything else if the pointer is not within the hitArea
        // There is also no longer a need to hitTest children.
        if (displayObject.hitArea) {
            if (hitTest) {
                displayObject.worldTransform.applyInverse(point, this._tempPoint);
                if (!displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
                    hitTest = false;
                    hitTestChildren = false;
                }
                else {
                    hit = true;
                }
            }
            interactiveParent = false;
        }
        // If there is a mask, no need to hitTest against anything else if the pointer is not within the mask.
        // We still want to hitTestChildren, however, to ensure a mouseout can still be generated.
        // https://github.com/pixijs/pixi.js/issues/5135
        else if (displayObject._mask) {
            if (hitTest) {
                if (!(displayObject._mask.containsPoint && displayObject._mask.containsPoint(point))) {
                    hitTest = false;
                }
            }
        }
        // ** FREE TIP **! If an object is not interactive or has no buttons in it
        // (such as a game scene!) set interactiveChildren to false for that displayObject.
        // This will allow PixiJS to completely ignore and bypass checking the displayObjects children.
        if (hitTestChildren && displayObject.interactiveChildren && displayObject.children) {
            var children = displayObject.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                // time to get recursive.. if this function will return if something is hit..
                var childHit = this.recursiveFindHit(interactionEvent, child, func, hitTest, interactiveParent);
                if (childHit) {
                    // its a good idea to check if a child has lost its parent.
                    // this means it has been removed whilst looping so its best
                    if (!child.parent) {
                        continue;
                    }
                    // we no longer need to hit test any more objects in this container as we we
                    // now know the parent has been hit
                    interactiveParent = false;
                    // If the child is interactive , that means that the object hit was actually
                    // interactive and not just the child of an interactive object.
                    // This means we no longer need to hit test anything else. We still need to run
                    // through all objects, but we don't need to perform any hit tests.
                    if (childHit) {
                        if (interactionEvent.target) {
                            hitTest = false;
                        }
                        hit = true;
                    }
                }
            }
        }
        // no point running this if the item is not interactive or does not have an interactive parent.
        if (interactive) {
            // if we are hit testing (as in we have no hit any objects yet)
            // We also don't need to worry about hit testing if once of the displayObjects children
            // has already been hit - but only if it was interactive, otherwise we need to keep
            // looking for an interactive child, just in case we hit one
            if (hitTest && !interactionEvent.target) {
                // already tested against hitArea if it is defined
                if (!displayObject.hitArea && displayObject.containsPoint) {
                    if (displayObject.containsPoint(point)) {
                        hit = true;
                    }
                }
            }
            if (displayObject.interactive) {
                if (hit && !interactionEvent.target) {
                    interactionEvent.target = displayObject;
                }
                if (func) {
                    func(interactionEvent, displayObject, !!hit);
                }
            }
        }
        return hit;
    };
    /**
     * This function is provides a neat way of crawling through the scene graph and running a
     * specified function on all interactive objects it finds. It will also take care of hit
     * testing the interactive objects and passes the hit across in the function.
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - event containing the point that
     *  is tested for collision
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - the displayObject
     *  that will be hit test (recursively crawls its children)
     * @param {Function} [func] - the function that will be called on each interactive object. The
     *  interactionEvent, displayObject and hit will be passed to the function
     * @param {boolean} [hitTest] - this indicates if the objects inside should be hit test against the point
     * @return {boolean} returns true if the displayObject hit the point
     */
    TreeSearch.prototype.findHit = function (interactionEvent, displayObject, func, hitTest) {
        this.recursiveFindHit(interactionEvent, displayObject, func, hitTest, false);
    };
    return TreeSearch;
}());

/**
 * Interface for classes that represent a hit area.
 *
 * It is implemented by the following classes:
 * - {@link PIXI.Circle}
 * - {@link PIXI.Ellipse}
 * - {@link PIXI.Polygon}
 * - {@link PIXI.RoundedRectangle}
 *
 * @interface IHitArea
 * @memberof PIXI
 */
/**
 * Checks whether the x and y coordinates given are contained within this area
 *
 * @method
 * @name contains
 * @memberof PIXI.IHitArea#
 * @param {number} x - The X coordinate of the point to test
 * @param {number} y - The Y coordinate of the point to test
 * @return {boolean} Whether the x/y coordinates are within this area
 */
/**
 * Default property values of interactive objects
 * Used by {@link PIXI.InteractionManager} to automatically give all DisplayObjects these properties
 *
 * @private
 * @name interactiveTarget
 * @type {Object}
 * @memberof PIXI
 * @example
 *      function MyObject() {}
 *
 *      Object.assign(
 *          DisplayObject.prototype,
 *          PIXI.interactiveTarget
 *      );
 */
var interactiveTarget = {
    interactive: false,
    interactiveChildren: true,
    hitArea: null,
    /**
     * If enabled, the mouse cursor use the pointer behavior when hovered over the displayObject if it is interactive
     * Setting this changes the 'cursor' property to `'pointer'`.
     *
     * @example
     * const sprite = new PIXI.Sprite(texture);
     * sprite.interactive = true;
     * sprite.buttonMode = true;
     * @member {boolean}
     * @memberof PIXI.DisplayObject#
     */
    get buttonMode() {
        return this.cursor === 'pointer';
    },
    set buttonMode(value) {
        if (value) {
            this.cursor = 'pointer';
        }
        else if (this.cursor === 'pointer') {
            this.cursor = null;
        }
    },
    /**
     * This defines what cursor mode is used when the mouse cursor
     * is hovered over the displayObject.
     *
     * @example
     * const sprite = new PIXI.Sprite(texture);
     * sprite.interactive = true;
     * sprite.cursor = 'wait';
     * @see https://developer.mozilla.org/en/docs/Web/CSS/cursor
     *
     * @member {string}
     * @memberof PIXI.DisplayObject#
     */
    cursor: null,
    /**
     * Internal set of all active pointers, by identifier
     *
     * @member {Map<number, InteractionTrackingData>}
     * @memberof PIXI.DisplayObject#
     * @private
     */
    get trackedPointers() {
        if (this._trackedPointers === undefined)
            { this._trackedPointers = {}; }
        return this._trackedPointers;
    },
    /**
     * Map of all tracked pointers, by identifier. Use trackedPointers to access.
     *
     * @private
     * @type {Map<number, InteractionTrackingData>}
     */
    _trackedPointers: undefined,
};

// Mix interactiveTarget into DisplayObject.prototype
DisplayObject.mixin(interactiveTarget);
var MOUSE_POINTER_ID = 1;
// helpers for hitTest() - only used inside hitTest()
var hitTestEvent = {
    target: null,
    data: {
        global: null,
    },
};
/**
 * The interaction manager deals with mouse, touch and pointer events.
 *
 * Any DisplayObject can be interactive if its `interactive` property is set to true.
 *
 * This manager also supports multitouch.
 *
 * An instance of this class is automatically created by default, and can be found at `renderer.plugins.interaction`
 *
 * @class
 * @extends PIXI.utils.EventEmitter
 * @memberof PIXI
 */
var InteractionManager = /** @class */ (function (_super) {
    __extends(InteractionManager, _super);
    /**
     * @param {PIXI.CanvasRenderer|PIXI.Renderer} renderer - A reference to the current renderer
     * @param {object} [options] - The options for the manager.
     * @param {boolean} [options.autoPreventDefault=true] - Should the manager automatically prevent default browser actions.
     * @param {number} [options.interactionFrequency=10] - Maximum frequency (ms) at pointer over/out states will be checked.
     * @param {number} [options.useSystemTicker=true] - Whether to add {@link tickerUpdate} to {@link PIXI.Ticker.system}.
     */
    function InteractionManager(renderer, options) {
        var _this = _super.call(this) || this;
        options = options || {};
        /**
         * The renderer this interaction manager works for.
         *
         * @member {PIXI.AbstractRenderer}
         */
        _this.renderer = renderer;
        /**
         * Should default browser actions automatically be prevented.
         * Does not apply to pointer events for backwards compatibility
         * preventDefault on pointer events stops mouse events from firing
         * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
         *
         * @member {boolean}
         * @default true
         */
        _this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : true;
        /**
         * Maximum frequency in milliseconds at which pointer over/out states will be checked by {@link tickerUpdate}.
         *
         * @member {number}
         * @default 10
         */
        _this.interactionFrequency = options.interactionFrequency || 10;
        /**
         * The mouse data
         *
         * @member {PIXI.InteractionData}
         */
        _this.mouse = new InteractionData();
        _this.mouse.identifier = MOUSE_POINTER_ID;
        // setting the mouse to start off far off screen will mean that mouse over does
        //  not get called before we even move the mouse.
        _this.mouse.global.set(-999999);
        /**
         * Actively tracked InteractionData
         *
         * @private
         * @member {Object.<number,PIXI.InteractionData>}
         */
        _this.activeInteractionData = {};
        _this.activeInteractionData[MOUSE_POINTER_ID] = _this.mouse;
        /**
         * Pool of unused InteractionData
         *
         * @private
         * @member {PIXI.InteractionData[]}
         */
        _this.interactionDataPool = [];
        /**
         * An event data object to handle all the event tracking/dispatching
         *
         * @member {object}
         */
        _this.eventData = new InteractionEvent();
        /**
         * The DOM element to bind to.
         *
         * @protected
         * @member {HTMLElement}
         */
        _this.interactionDOMElement = null;
        /**
         * This property determines if mousemove and touchmove events are fired only when the cursor
         * is over the object.
         * Setting to true will make things work more in line with how the DOM version works.
         * Setting to false can make things easier for things like dragging
         * It is currently set to false as this is how PixiJS used to work. This will be set to true in
         * future versions of pixi.
         *
         * @member {boolean}
         * @default false
         */
        _this.moveWhenInside = false;
        /**
         * Have events been attached to the dom element?
         *
         * @protected
         * @member {boolean}
         */
        _this.eventsAdded = false;
        /**
         * Has the system ticker been added?
         *
         * @protected
         * @member {boolean}
         */
        _this.tickerAdded = false;
        /**
         * Is the mouse hovering over the renderer? If working in worker mouse considered to be over renderer by default.
         *
         * @protected
         * @member {boolean}
         */
        _this.mouseOverRenderer = !('PointerEvent' in self);
        /**
         * Does the device support touch events
         * https://www.w3.org/TR/touch-events/
         *
         * @readonly
         * @member {boolean}
         */
        _this.supportsTouchEvents = 'ontouchstart' in self;
        /**
         * Does the device support pointer events
         * https://www.w3.org/Submission/pointer-events/
         *
         * @readonly
         * @member {boolean}
         */
        _this.supportsPointerEvents = !!self.PointerEvent;
        // this will make it so that you don't have to call bind all the time
        /**
         * @private
         * @member {Function}
         */
        _this.onPointerUp = _this.onPointerUp.bind(_this);
        _this.processPointerUp = _this.processPointerUp.bind(_this);
        /**
         * @private
         * @member {Function}
         */
        _this.onPointerCancel = _this.onPointerCancel.bind(_this);
        _this.processPointerCancel = _this.processPointerCancel.bind(_this);
        /**
         * @private
         * @member {Function}
         */
        _this.onPointerDown = _this.onPointerDown.bind(_this);
        _this.processPointerDown = _this.processPointerDown.bind(_this);
        /**
         * @private
         * @member {Function}
         */
        _this.onPointerMove = _this.onPointerMove.bind(_this);
        _this.processPointerMove = _this.processPointerMove.bind(_this);
        /**
         * @private
         * @member {Function}
         */
        _this.onPointerOut = _this.onPointerOut.bind(_this);
        _this.processPointerOverOut = _this.processPointerOverOut.bind(_this);
        /**
         * @private
         * @member {Function}
         */
        _this.onPointerOver = _this.onPointerOver.bind(_this);
        /**
         * Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
         * values, objects are handled as dictionaries of CSS values for interactionDOMElement,
         * and functions are called instead of changing the CSS.
         * Default CSS cursor values are provided for 'default' and 'pointer' modes.
         * @member {Object.<string, Object>}
         */
        _this.cursorStyles = {
            default: 'inherit',
            pointer: 'pointer',
        };
        /**
         * The mode of the cursor that is being used.
         * The value of this is a key from the cursorStyles dictionary.
         *
         * @member {string}
         */
        _this.currentCursorMode = null;
        /**
         * Internal cached let.
         *
         * @private
         * @member {string}
         */
        _this.cursor = null;
        /**
         * The current resolution / device pixel ratio.
         *
         * @member {number}
         * @default 1
         */
        _this.resolution = 1;
        /**
         * Delayed pointer events. Used to guarantee correct ordering of over/out events.
         *
         * @private
         * @member {Array}
         */
        _this.delayedEvents = [];
        /**
         * TreeSearch component that is used to hitTest stage tree
         *
         * @private
         * @member {PIXI.TreeSearch}
         */
        _this.search = new TreeSearch();
        /**
         * Used as a last rendered object in case renderer doesnt have _lastObjectRendered
         * @member {DisplayObject}
         * @private
         */
        _this._tempDisplayObject = new TemporaryDisplayObject();
        /**
         * An options object specifies characteristics about the event listener.
         * @private
         * @readonly
         * @member {Object.<string, boolean>}
         */
        _this._eventListenerOptions = { capture: true, passive: false };
        /**
         * Fired when a pointer device button (usually a mouse left-button) is pressed on the display
         * object.
         *
         * @event PIXI.InteractionManager#mousedown
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
         * on the display object.
         *
         * @event PIXI.InteractionManager#rightdown
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button (usually a mouse left-button) is released over the display
         * object.
         *
         * @event PIXI.InteractionManager#mouseup
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is released
         * over the display object.
         *
         * @event PIXI.InteractionManager#rightup
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button (usually a mouse left-button) is pressed and released on
         * the display object.
         *
         * @event PIXI.InteractionManager#click
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
         * and released on the display object.
         *
         * @event PIXI.InteractionManager#rightclick
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button (usually a mouse left-button) is released outside the
         * display object that initially registered a
         * [mousedown]{@link PIXI.InteractionManager#event:mousedown}.
         *
         * @event PIXI.InteractionManager#mouseupoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is released
         * outside the display object that initially registered a
         * [rightdown]{@link PIXI.InteractionManager#event:rightdown}.
         *
         * @event PIXI.InteractionManager#rightupoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device (usually a mouse) is moved while over the display object
         *
         * @event PIXI.InteractionManager#mousemove
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device (usually a mouse) is moved onto the display object
         *
         * @event PIXI.InteractionManager#mouseover
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device (usually a mouse) is moved off the display object
         *
         * @event PIXI.InteractionManager#mouseout
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is pressed on the display object.
         *
         * @event PIXI.InteractionManager#pointerdown
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is released over the display object.
         * Not always fired when some buttons are held down while others are released. In those cases,
         * use [mousedown]{@link PIXI.InteractionManager#event:mousedown} and
         * [mouseup]{@link PIXI.InteractionManager#event:mouseup} instead.
         *
         * @event PIXI.InteractionManager#pointerup
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when the operating system cancels a pointer event
         *
         * @event PIXI.InteractionManager#pointercancel
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is pressed and released on the display object.
         *
         * @event PIXI.InteractionManager#pointertap
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is released outside the display object that initially
         * registered a [pointerdown]{@link PIXI.InteractionManager#event:pointerdown}.
         *
         * @event PIXI.InteractionManager#pointerupoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device is moved while over the display object
         *
         * @event PIXI.InteractionManager#pointermove
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device is moved onto the display object
         *
         * @event PIXI.InteractionManager#pointerover
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device is moved off the display object
         *
         * @event PIXI.InteractionManager#pointerout
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is placed on the display object.
         *
         * @event PIXI.InteractionManager#touchstart
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is removed from the display object.
         *
         * @event PIXI.InteractionManager#touchend
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when the operating system cancels a touch
         *
         * @event PIXI.InteractionManager#touchcancel
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is placed and removed from the display object.
         *
         * @event PIXI.InteractionManager#tap
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is removed outside of the display object that initially
         * registered a [touchstart]{@link PIXI.InteractionManager#event:touchstart}.
         *
         * @event PIXI.InteractionManager#touchendoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is moved along the display object.
         *
         * @event PIXI.InteractionManager#touchmove
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button (usually a mouse left-button) is pressed on the display.
         * object. DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#mousedown
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
         * on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#rightdown
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button (usually a mouse left-button) is released over the display
         * object. DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#mouseup
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is released
         * over the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#rightup
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button (usually a mouse left-button) is pressed and released on
         * the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#click
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
         * and released on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#rightclick
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button (usually a mouse left-button) is released outside the
         * display object that initially registered a
         * [mousedown]{@link PIXI.DisplayObject#event:mousedown}.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#mouseupoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is released
         * outside the display object that initially registered a
         * [rightdown]{@link PIXI.DisplayObject#event:rightdown}.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#rightupoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device (usually a mouse) is moved while over the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#mousemove
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device (usually a mouse) is moved onto the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#mouseover
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device (usually a mouse) is moved off the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#mouseout
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is pressed on the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointerdown
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is released over the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointerup
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when the operating system cancels a pointer event.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointercancel
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is pressed and released on the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointertap
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device button is released outside the display object that initially
         * registered a [pointerdown]{@link PIXI.DisplayObject#event:pointerdown}.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointerupoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device is moved while over the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointermove
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device is moved onto the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointerover
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a pointer device is moved off the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#pointerout
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is placed on the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#touchstart
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is removed from the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#touchend
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when the operating system cancels a touch.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#touchcancel
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is placed and removed from the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#tap
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is removed outside of the display object that initially
         * registered a [touchstart]{@link PIXI.DisplayObject#event:touchstart}.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#touchendoutside
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        /**
         * Fired when a touch point is moved along the display object.
         * DisplayObject's `interactive` property must be set to `true` to fire event.
         *
         * This comes from the @pixi/interaction package.
         *
         * @event PIXI.DisplayObject#touchmove
         * @param {PIXI.InteractionEvent} event - Interaction event
         */
        _this._useSystemTicker = options.useSystemTicker !== undefined ? options.useSystemTicker : true;
        _this.setTargetElement(_this.renderer.view, _this.renderer.resolution);
        return _this;
    }
    Object.defineProperty(InteractionManager.prototype, "useSystemTicker", {
        /**
         * Should the InteractionManager automatically add {@link tickerUpdate} to {@link PIXI.Ticker.system}.
         *
         * @member {boolean}
         * @default true
         */
        get: function () {
            return this._useSystemTicker;
        },
        set: function (useSystemTicker) {
            this._useSystemTicker = useSystemTicker;
            if (useSystemTicker) {
                this.addTickerListener();
            }
            else {
                this.removeTickerListener();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InteractionManager.prototype, "lastObjectRendered", {
        /**
         * Last rendered object or temp object
         * @readonly
         * @protected
         * @member {PIXI.DisplayObject}
         */
        get: function () {
            return this.renderer._lastObjectRendered || this._tempDisplayObject;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Hit tests a point against the display tree, returning the first interactive object that is hit.
     *
     * @param {PIXI.Point} globalPoint - A point to hit test with, in global space.
     * @param {PIXI.Container} [root] - The root display object to start from. If omitted, defaults
     * to the last rendered root of the associated renderer.
     * @return {PIXI.DisplayObject} The hit display object, if any.
     */
    InteractionManager.prototype.hitTest = function (globalPoint, root) {
        // clear the target for our hit test
        hitTestEvent.target = null;
        // assign the global point
        hitTestEvent.data.global = globalPoint;
        // ensure safety of the root
        if (!root) {
            root = this.lastObjectRendered;
        }
        // run the hit test
        this.processInteractive(hitTestEvent, root, null, true);
        // return our found object - it'll be null if we didn't hit anything
        return hitTestEvent.target;
    };
    /**
     * Sets the DOM element which will receive mouse/touch events. This is useful for when you have
     * other DOM elements on top of the renderers Canvas element. With this you'll be bale to delegate
     * another DOM element to receive those events.
     *
     * @param {HTMLElement} element - the DOM element which will receive mouse and touch events.
     * @param {number} [resolution=1] - The resolution / device pixel ratio of the new element (relative to the canvas).
     */
    InteractionManager.prototype.setTargetElement = function (element, resolution) {
        if (resolution === void 0) { resolution = 1; }
        this.removeTickerListener();
        this.removeEvents();
        this.interactionDOMElement = element;
        this.resolution = resolution;
        this.addEvents();
        this.addTickerListener();
    };
    /**
     * Add the ticker listener
     *
     * @private
     */
    InteractionManager.prototype.addTickerListener = function () {
        if (this.tickerAdded || !this.interactionDOMElement || !this._useSystemTicker) {
            return;
        }
        Ticker.system.add(this.tickerUpdate, this, UPDATE_PRIORITY.INTERACTION);
        this.tickerAdded = true;
    };
    /**
     * Remove the ticker listener
     *
     * @private
     */
    InteractionManager.prototype.removeTickerListener = function () {
        if (!this.tickerAdded) {
            return;
        }
        Ticker.system.remove(this.tickerUpdate, this);
        this.tickerAdded = false;
    };
    /**
     * Registers all the DOM events
     *
     * @private
     */
    InteractionManager.prototype.addEvents = function () {
        if (this.eventsAdded || !this.interactionDOMElement) {
            return;
        }
        var style = this.interactionDOMElement.style;
        if (self.navigator.msPointerEnabled) {
            style.msContentZooming = 'none';
            style.msTouchAction = 'none';
        }
        else if (this.supportsPointerEvents) {
            style.touchAction = 'none';
        }
        /*
         * These events are added first, so that if pointer events are normalized, they are fired
         * in the same order as non-normalized events. ie. pointer event 1st, mouse / touch 2nd
         */
        if (this.supportsPointerEvents) {
            self.document.addEventListener('pointermove', this.onPointerMove, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, this._eventListenerOptions);
            // pointerout is fired in addition to pointerup (for touch events) and pointercancel
            // we already handle those, so for the purposes of what we do in onPointerOut, we only
            // care about the pointerleave event
            this.interactionDOMElement.addEventListener('pointerleave', this.onPointerOut, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, this._eventListenerOptions);
            self.addEventListener('pointercancel', this.onPointerCancel, this._eventListenerOptions);
            self.addEventListener('pointerup', this.onPointerUp, this._eventListenerOptions);
        }
        else {
            self.document.addEventListener('mousemove', this.onPointerMove, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, this._eventListenerOptions);
            self.addEventListener('mouseup', this.onPointerUp, this._eventListenerOptions);
        }
        // always look directly for touch events so that we can provide original data
        // In a future version we should change this to being just a fallback and rely solely on
        // PointerEvents whenever available
        if (this.supportsTouchEvents) {
            this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('touchcancel', this.onPointerCancel, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, this._eventListenerOptions);
            this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, this._eventListenerOptions);
        }
        this.eventsAdded = true;
    };
    /**
     * Removes all the DOM events that were previously registered
     *
     * @private
     */
    InteractionManager.prototype.removeEvents = function () {
        if (!this.eventsAdded || !this.interactionDOMElement) {
            return;
        }
        var style = this.interactionDOMElement.style;
        if (self.navigator.msPointerEnabled) {
            style.msContentZooming = '';
            style.msTouchAction = '';
        }
        else if (this.supportsPointerEvents) {
            style.touchAction = '';
        }
        if (this.supportsPointerEvents) {
            self.document.removeEventListener('pointermove', this.onPointerMove, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('pointerdown', this.onPointerDown, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('pointerleave', this.onPointerOut, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('pointerover', this.onPointerOver, this._eventListenerOptions);
            self.removeEventListener('pointercancel', this.onPointerCancel, this._eventListenerOptions);
            self.removeEventListener('pointerup', this.onPointerUp, this._eventListenerOptions);
        }
        else {
            self.document.removeEventListener('mousemove', this.onPointerMove, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('mousedown', this.onPointerDown, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('mouseout', this.onPointerOut, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('mouseover', this.onPointerOver, this._eventListenerOptions);
            self.removeEventListener('mouseup', this.onPointerUp, this._eventListenerOptions);
        }
        if (this.supportsTouchEvents) {
            this.interactionDOMElement.removeEventListener('touchstart', this.onPointerDown, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('touchcancel', this.onPointerCancel, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('touchend', this.onPointerUp, this._eventListenerOptions);
            this.interactionDOMElement.removeEventListener('touchmove', this.onPointerMove, this._eventListenerOptions);
        }
        this.interactionDOMElement = null;
        this.eventsAdded = false;
    };
    /**
     * Updates the state of interactive objects if at least {@link interactionFrequency}
     * milliseconds have passed since the last invocation.
     *
     * Invoked by a throttled ticker update from {@link PIXI.Ticker.system}.
     *
     * @param {number} deltaTime - time delta since the last call
     */
    InteractionManager.prototype.tickerUpdate = function (deltaTime) {
        this._deltaTime += deltaTime;
        if (this._deltaTime < this.interactionFrequency) {
            return;
        }
        this._deltaTime = 0;
        this.update();
    };
    /**
     * Updates the state of interactive objects.
     */
    InteractionManager.prototype.update = function () {
        if (!this.interactionDOMElement) {
            return;
        }
        // if the user move the mouse this check has already been done using the mouse move!
        if (this._didMove) {
            this._didMove = false;
            return;
        }
        this.cursor = null;
        // Resets the flag as set by a stopPropagation call. This flag is usually reset by a user interaction of any kind,
        // but there was a scenario of a display object moving under a static mouse cursor.
        // In this case, mouseover and mouseevents would not pass the flag test in dispatchEvent function
        for (var k in this.activeInteractionData) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.activeInteractionData.hasOwnProperty(k)) {
                var interactionData = this.activeInteractionData[k];
                if (interactionData.originalEvent && interactionData.pointerType !== 'touch') {
                    var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, interactionData.originalEvent, interactionData);
                    this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerOverOut, true);
                }
            }
        }
        this.setCursorMode(this.cursor);
    };
    /**
     * Sets the current cursor mode, handling any callbacks or CSS style changes.
     *
     * @param {string} mode - cursor mode, a key from the cursorStyles dictionary
     */
    InteractionManager.prototype.setCursorMode = function (mode) {
        mode = mode || 'default';
        var applyStyles = true;
        // offscreen canvas does not support setting styles, but cursor modes can be functions,
        // in order to handle pixi rendered cursors, so we can't bail
        if (self.OffscreenCanvas && this.interactionDOMElement instanceof OffscreenCanvas) {
            applyStyles = false;
        }
        // if the mode didn't actually change, bail early
        if (this.currentCursorMode === mode) {
            return;
        }
        this.currentCursorMode = mode;
        var style = this.cursorStyles[mode];
        // only do things if there is a cursor style for it
        if (style) {
            switch (typeof style) {
                case 'string':
                    // string styles are handled as cursor CSS
                    if (applyStyles) {
                        this.interactionDOMElement.style.cursor = style;
                    }
                    break;
                case 'function':
                    // functions are just called, and passed the cursor mode
                    style(mode);
                    break;
                case 'object':
                    // if it is an object, assume that it is a dictionary of CSS styles,
                    // apply it to the interactionDOMElement
                    if (applyStyles) {
                        Object.assign(this.interactionDOMElement.style, style);
                    }
                    break;
            }
        }
        else if (applyStyles && typeof mode === 'string' && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) {
            // if it mode is a string (not a Symbol) and cursorStyles doesn't have any entry
            // for the mode, then assume that the dev wants it to be CSS for the cursor.
            this.interactionDOMElement.style.cursor = mode;
        }
    };
    /**
     * Dispatches an event on the display object that was interacted with
     *
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - the display object in question
     * @param {string} eventString - the name of the event (e.g, mousedown)
     * @param {PIXI.InteractionEvent} eventData - the event data object
     * @private
     */
    InteractionManager.prototype.dispatchEvent = function (displayObject, eventString, eventData) {
        // Even if the event was stopped, at least dispatch any remaining events
        // for the same display object.
        if (!eventData.stopPropagationHint || displayObject === eventData.stopsPropagatingAt) {
            eventData.currentTarget = displayObject;
            eventData.type = eventString;
            displayObject.emit(eventString, eventData);
            if (displayObject[eventString]) {
                displayObject[eventString](eventData);
            }
        }
    };
    /**
     * Puts a event on a queue to be dispatched later. This is used to guarantee correct
     * ordering of over/out events.
     *
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - the display object in question
     * @param {string} eventString - the name of the event (e.g, mousedown)
     * @param {object} eventData - the event data object
     * @private
     */
    InteractionManager.prototype.delayDispatchEvent = function (displayObject, eventString, eventData) {
        this.delayedEvents.push({ displayObject: displayObject, eventString: eventString, eventData: eventData });
    };
    /**
     * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
     * resulting value is stored in the point. This takes into account the fact that the DOM
     * element could be scaled and positioned anywhere on the screen.
     *
     * @param  {PIXI.IPointData} point - the point that the result will be stored in
     * @param  {number} x - the x coord of the position to map
     * @param  {number} y - the y coord of the position to map
     */
    InteractionManager.prototype.mapPositionToPoint = function (point, x, y) {
        var rect;
        // IE 11 fix
        if (!this.interactionDOMElement.parentElement) {
            rect = {
                x: 0,
                y: 0,
                width: this.interactionDOMElement.width,
                height: this.interactionDOMElement.height,
                left: 0,
                top: 0
            };
        }
        else {
            rect = this.interactionDOMElement.getBoundingClientRect();
        }
        var resolutionMultiplier = 1.0 / this.resolution;
        point.x = ((x - rect.left) * (this.interactionDOMElement.width / rect.width)) * resolutionMultiplier;
        point.y = ((y - rect.top) * (this.interactionDOMElement.height / rect.height)) * resolutionMultiplier;
    };
    /**
     * This function is provides a neat way of crawling through the scene graph and running a
     * specified function on all interactive objects it finds. It will also take care of hit
     * testing the interactive objects and passes the hit across in the function.
     *
     * @protected
     * @param {PIXI.InteractionEvent} interactionEvent - event containing the point that
     *  is tested for collision
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - the displayObject
     *  that will be hit test (recursively crawls its children)
     * @param {Function} [func] - the function that will be called on each interactive object. The
     *  interactionEvent, displayObject and hit will be passed to the function
     * @param {boolean} [hitTest] - indicates whether we want to calculate hits
     *  or just iterate through all interactive objects
     */
    InteractionManager.prototype.processInteractive = function (interactionEvent, displayObject, func, hitTest) {
        var hit = this.search.findHit(interactionEvent, displayObject, func, hitTest);
        var delayedEvents = this.delayedEvents;
        if (!delayedEvents.length) {
            return hit;
        }
        // Reset the propagation hint, because we start deeper in the tree again.
        interactionEvent.stopPropagationHint = false;
        var delayedLen = delayedEvents.length;
        this.delayedEvents = [];
        for (var i = 0; i < delayedLen; i++) {
            var _a = delayedEvents[i], displayObject_1 = _a.displayObject, eventString = _a.eventString, eventData = _a.eventData;
            // When we reach the object we wanted to stop propagating at,
            // set the propagation hint.
            if (eventData.stopsPropagatingAt === displayObject_1) {
                eventData.stopPropagationHint = true;
            }
            this.dispatchEvent(displayObject_1, eventString, eventData);
        }
        return hit;
    };
    /**
     * Is called when the pointer button is pressed down on the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being pressed down
     */
    InteractionManager.prototype.onPointerDown = function (originalEvent) {
        // if we support touch events, then only use those for touch events, not pointer events
        if (this.supportsTouchEvents && originalEvent.pointerType === 'touch')
            { return; }
        var events = this.normalizeToPointerData(originalEvent);
        /*
         * No need to prevent default on natural pointer events, as there are no side effects
         * Normalized events, however, may have the double mousedown/touchstart issue on the native android browser,
         * so still need to be prevented.
         */
        // Guaranteed that there will be at least one event in events, and all events must have the same pointer type
        if (this.autoPreventDefault && events[0].isNormalized) {
            var cancelable = originalEvent.cancelable || !('cancelable' in originalEvent);
            if (cancelable) {
                originalEvent.preventDefault();
            }
        }
        var eventLen = events.length;
        for (var i = 0; i < eventLen; i++) {
            var event = events[i];
            var interactionData = this.getInteractionDataForPointerId(event);
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
            interactionEvent.data.originalEvent = originalEvent;
            this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerDown, true);
            this.emit('pointerdown', interactionEvent);
            if (event.pointerType === 'touch') {
                this.emit('touchstart', interactionEvent);
            }
            // emit a mouse event for "pen" pointers, the way a browser would emit a fallback event
            else if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                var isRightButton = event.button === 2;
                this.emit(isRightButton ? 'rightdown' : 'mousedown', this.eventData);
            }
        }
    };
    /**
     * Processes the result of the pointer down check and dispatches the event if need be
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */
    InteractionManager.prototype.processPointerDown = function (interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        if (hit) {
            if (!displayObject.trackedPointers[id]) {
                displayObject.trackedPointers[id] = new InteractionTrackingData(id);
            }
            this.dispatchEvent(displayObject, 'pointerdown', interactionEvent);
            if (data.pointerType === 'touch') {
                this.dispatchEvent(displayObject, 'touchstart', interactionEvent);
            }
            else if (data.pointerType === 'mouse' || data.pointerType === 'pen') {
                var isRightButton = data.button === 2;
                if (isRightButton) {
                    displayObject.trackedPointers[id].rightDown = true;
                }
                else {
                    displayObject.trackedPointers[id].leftDown = true;
                }
                this.dispatchEvent(displayObject, isRightButton ? 'rightdown' : 'mousedown', interactionEvent);
            }
        }
    };
    /**
     * Is called when the pointer button is released on the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being released
     * @param {boolean} cancelled - true if the pointer is cancelled
     * @param {Function} func - Function passed to {@link processInteractive}
     */
    InteractionManager.prototype.onPointerComplete = function (originalEvent, cancelled, func) {
        var events = this.normalizeToPointerData(originalEvent);
        var eventLen = events.length;
        // if the event wasn't targeting our canvas, then consider it to be pointerupoutside
        // in all cases (unless it was a pointercancel)
        var eventAppend = originalEvent.target !== this.interactionDOMElement ? 'outside' : '';
        for (var i = 0; i < eventLen; i++) {
            var event = events[i];
            var interactionData = this.getInteractionDataForPointerId(event);
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
            interactionEvent.data.originalEvent = originalEvent;
            // perform hit testing for events targeting our canvas or cancel events
            this.processInteractive(interactionEvent, this.lastObjectRendered, func, cancelled || !eventAppend);
            this.emit(cancelled ? 'pointercancel' : "pointerup" + eventAppend, interactionEvent);
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                var isRightButton = event.button === 2;
                this.emit(isRightButton ? "rightup" + eventAppend : "mouseup" + eventAppend, interactionEvent);
            }
            else if (event.pointerType === 'touch') {
                this.emit(cancelled ? 'touchcancel' : "touchend" + eventAppend, interactionEvent);
                this.releaseInteractionDataForPointerId(event.pointerId);
            }
        }
    };
    /**
     * Is called when the pointer button is cancelled
     *
     * @private
     * @param {PointerEvent} event - The DOM event of a pointer button being released
     */
    InteractionManager.prototype.onPointerCancel = function (event) {
        // if we support touch events, then only use those for touch events, not pointer events
        if (this.supportsTouchEvents && event.pointerType === 'touch')
            { return; }
        this.onPointerComplete(event, true, this.processPointerCancel);
    };
    /**
     * Processes the result of the pointer cancel check and dispatches the event if need be
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - The display object that was tested
     */
    InteractionManager.prototype.processPointerCancel = function (interactionEvent, displayObject) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        if (displayObject.trackedPointers[id] !== undefined) {
            delete displayObject.trackedPointers[id];
            this.dispatchEvent(displayObject, 'pointercancel', interactionEvent);
            if (data.pointerType === 'touch') {
                this.dispatchEvent(displayObject, 'touchcancel', interactionEvent);
            }
        }
    };
    /**
     * Is called when the pointer button is released on the renderer element
     *
     * @private
     * @param {PointerEvent} event - The DOM event of a pointer button being released
     */
    InteractionManager.prototype.onPointerUp = function (event) {
        // if we support touch events, then only use those for touch events, not pointer events
        if (this.supportsTouchEvents && event.pointerType === 'touch')
            { return; }
        this.onPointerComplete(event, false, this.processPointerUp);
    };
    /**
     * Processes the result of the pointer up check and dispatches the event if need be
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */
    InteractionManager.prototype.processPointerUp = function (interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        var trackingData = displayObject.trackedPointers[id];
        var isTouch = data.pointerType === 'touch';
        var isMouse = (data.pointerType === 'mouse' || data.pointerType === 'pen');
        // need to track mouse down status in the mouse block so that we can emit
        // event in a later block
        var isMouseTap = false;
        // Mouse only
        if (isMouse) {
            var isRightButton = data.button === 2;
            var flags = InteractionTrackingData.FLAGS;
            var test = isRightButton ? flags.RIGHT_DOWN : flags.LEFT_DOWN;
            var isDown = trackingData !== undefined && (trackingData.flags & test);
            if (hit) {
                this.dispatchEvent(displayObject, isRightButton ? 'rightup' : 'mouseup', interactionEvent);
                if (isDown) {
                    this.dispatchEvent(displayObject, isRightButton ? 'rightclick' : 'click', interactionEvent);
                    // because we can confirm that the mousedown happened on this object, flag for later emit of pointertap
                    isMouseTap = true;
                }
            }
            else if (isDown) {
                this.dispatchEvent(displayObject, isRightButton ? 'rightupoutside' : 'mouseupoutside', interactionEvent);
            }
            // update the down state of the tracking data
            if (trackingData) {
                if (isRightButton) {
                    trackingData.rightDown = false;
                }
                else {
                    trackingData.leftDown = false;
                }
            }
        }
        // Pointers and Touches, and Mouse
        if (hit) {
            this.dispatchEvent(displayObject, 'pointerup', interactionEvent);
            if (isTouch)
                { this.dispatchEvent(displayObject, 'touchend', interactionEvent); }
            if (trackingData) {
                // emit pointertap if not a mouse, or if the mouse block decided it was a tap
                if (!isMouse || isMouseTap) {
                    this.dispatchEvent(displayObject, 'pointertap', interactionEvent);
                }
                if (isTouch) {
                    this.dispatchEvent(displayObject, 'tap', interactionEvent);
                    // touches are no longer over (if they ever were) when we get the touchend
                    // so we should ensure that we don't keep pretending that they are
                    trackingData.over = false;
                }
            }
        }
        else if (trackingData) {
            this.dispatchEvent(displayObject, 'pointerupoutside', interactionEvent);
            if (isTouch)
                { this.dispatchEvent(displayObject, 'touchendoutside', interactionEvent); }
        }
        // Only remove the tracking data if there is no over/down state still associated with it
        if (trackingData && trackingData.none) {
            delete displayObject.trackedPointers[id];
        }
    };
    /**
     * Is called when the pointer moves across the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer moving
     */
    InteractionManager.prototype.onPointerMove = function (originalEvent) {
        // if we support touch events, then only use those for touch events, not pointer events
        if (this.supportsTouchEvents && originalEvent.pointerType === 'touch')
            { return; }
        var events = this.normalizeToPointerData(originalEvent);
        if (events[0].pointerType === 'mouse' || events[0].pointerType === 'pen') {
            this._didMove = true;
            this.cursor = null;
        }
        var eventLen = events.length;
        for (var i = 0; i < eventLen; i++) {
            var event = events[i];
            var interactionData = this.getInteractionDataForPointerId(event);
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
            interactionEvent.data.originalEvent = originalEvent;
            this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerMove, true);
            this.emit('pointermove', interactionEvent);
            if (event.pointerType === 'touch')
                { this.emit('touchmove', interactionEvent); }
            if (event.pointerType === 'mouse' || event.pointerType === 'pen')
                { this.emit('mousemove', interactionEvent); }
        }
        if (events[0].pointerType === 'mouse') {
            this.setCursorMode(this.cursor);
            // TODO BUG for parents interactive object (border order issue)
        }
    };
    /**
     * Processes the result of the pointer move check and dispatches the event if need be
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */
    InteractionManager.prototype.processPointerMove = function (interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var isTouch = data.pointerType === 'touch';
        var isMouse = (data.pointerType === 'mouse' || data.pointerType === 'pen');
        if (isMouse) {
            this.processPointerOverOut(interactionEvent, displayObject, hit);
        }
        if (!this.moveWhenInside || hit) {
            this.dispatchEvent(displayObject, 'pointermove', interactionEvent);
            if (isTouch)
                { this.dispatchEvent(displayObject, 'touchmove', interactionEvent); }
            if (isMouse)
                { this.dispatchEvent(displayObject, 'mousemove', interactionEvent); }
        }
    };
    /**
     * Is called when the pointer is moved out of the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer being moved out
     */
    InteractionManager.prototype.onPointerOut = function (originalEvent) {
        // if we support touch events, then only use those for touch events, not pointer events
        if (this.supportsTouchEvents && originalEvent.pointerType === 'touch')
            { return; }
        var events = this.normalizeToPointerData(originalEvent);
        // Only mouse and pointer can call onPointerOut, so events will always be length 1
        var event = events[0];
        if (event.pointerType === 'mouse') {
            this.mouseOverRenderer = false;
            this.setCursorMode(null);
        }
        var interactionData = this.getInteractionDataForPointerId(event);
        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
        interactionEvent.data.originalEvent = event;
        this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerOverOut, false);
        this.emit('pointerout', interactionEvent);
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
            this.emit('mouseout', interactionEvent);
        }
        else {
            // we can get touchleave events after touchend, so we want to make sure we don't
            // introduce memory leaks
            this.releaseInteractionDataForPointerId(interactionData.identifier);
        }
    };
    /**
     * Processes the result of the pointer over/out check and dispatches the event if need be
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - The interaction event wrapping the DOM event
     * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - The display object that was tested
     * @param {boolean} hit - the result of the hit test on the display object
     */
    InteractionManager.prototype.processPointerOverOut = function (interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        var isMouse = (data.pointerType === 'mouse' || data.pointerType === 'pen');
        var trackingData = displayObject.trackedPointers[id];
        // if we just moused over the display object, then we need to track that state
        if (hit && !trackingData) {
            trackingData = displayObject.trackedPointers[id] = new InteractionTrackingData(id);
        }
        if (trackingData === undefined)
            { return; }
        if (hit && this.mouseOverRenderer) {
            if (!trackingData.over) {
                trackingData.over = true;
                this.delayDispatchEvent(displayObject, 'pointerover', interactionEvent);
                if (isMouse) {
                    this.delayDispatchEvent(displayObject, 'mouseover', interactionEvent);
                }
            }
            // only change the cursor if it has not already been changed (by something deeper in the
            // display tree)
            if (isMouse && this.cursor === null) {
                this.cursor = displayObject.cursor;
            }
        }
        else if (trackingData.over) {
            trackingData.over = false;
            this.dispatchEvent(displayObject, 'pointerout', this.eventData);
            if (isMouse) {
                this.dispatchEvent(displayObject, 'mouseout', interactionEvent);
            }
            // if there is no mouse down information for the pointer, then it is safe to delete
            if (trackingData.none) {
                delete displayObject.trackedPointers[id];
            }
        }
    };
    /**
     * Is called when the pointer is moved into the renderer element
     *
     * @private
     * @param {PointerEvent} originalEvent - The DOM event of a pointer button being moved into the renderer view
     */
    InteractionManager.prototype.onPointerOver = function (originalEvent) {
        var events = this.normalizeToPointerData(originalEvent);
        // Only mouse and pointer can call onPointerOver, so events will always be length 1
        var event = events[0];
        var interactionData = this.getInteractionDataForPointerId(event);
        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
        interactionEvent.data.originalEvent = event;
        if (event.pointerType === 'mouse') {
            this.mouseOverRenderer = true;
        }
        this.emit('pointerover', interactionEvent);
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
            this.emit('mouseover', interactionEvent);
        }
    };
    /**
     * Get InteractionData for a given pointerId. Store that data as well
     *
     * @private
     * @param {PointerEvent} event - Normalized pointer event, output from normalizeToPointerData
     * @return {PIXI.InteractionData} - Interaction data for the given pointer identifier
     */
    InteractionManager.prototype.getInteractionDataForPointerId = function (event) {
        var pointerId = event.pointerId;
        var interactionData;
        if (pointerId === MOUSE_POINTER_ID || event.pointerType === 'mouse') {
            interactionData = this.mouse;
        }
        else if (this.activeInteractionData[pointerId]) {
            interactionData = this.activeInteractionData[pointerId];
        }
        else {
            interactionData = this.interactionDataPool.pop() || new InteractionData();
            interactionData.identifier = pointerId;
            this.activeInteractionData[pointerId] = interactionData;
        }
        // copy properties from the event, so that we can make sure that touch/pointer specific
        // data is available
        interactionData.copyEvent(event);
        return interactionData;
    };
    /**
     * Return unused InteractionData to the pool, for a given pointerId
     *
     * @private
     * @param {number} pointerId - Identifier from a pointer event
     */
    InteractionManager.prototype.releaseInteractionDataForPointerId = function (pointerId) {
        var interactionData = this.activeInteractionData[pointerId];
        if (interactionData) {
            delete this.activeInteractionData[pointerId];
            interactionData.reset();
            this.interactionDataPool.push(interactionData);
        }
    };
    /**
     * Configure an InteractionEvent to wrap a DOM PointerEvent and InteractionData
     *
     * @private
     * @param {PIXI.InteractionEvent} interactionEvent - The event to be configured
     * @param {PointerEvent} pointerEvent - The DOM event that will be paired with the InteractionEvent
     * @param {PIXI.InteractionData} interactionData - The InteractionData that will be paired
     *        with the InteractionEvent
     * @return {PIXI.InteractionEvent} the interaction event that was passed in
     */
    InteractionManager.prototype.configureInteractionEventForDOMEvent = function (interactionEvent, pointerEvent, interactionData) {
        interactionEvent.data = interactionData;
        this.mapPositionToPoint(interactionData.global, pointerEvent.clientX, pointerEvent.clientY);
        // Not really sure why this is happening, but it's how a previous version handled things
        if (pointerEvent.pointerType === 'touch') {
            pointerEvent.globalX = interactionData.global.x;
            pointerEvent.globalY = interactionData.global.y;
        }
        interactionData.originalEvent = pointerEvent;
        interactionEvent.reset();
        return interactionEvent;
    };
    /**
     * Ensures that the original event object contains all data that a regular pointer event would have
     *
     * @private
     * @param {TouchEvent|MouseEvent|PointerEvent} event - The original event data from a touch or mouse event
     * @return {PointerEvent[]} An array containing a single normalized pointer event, in the case of a pointer
     *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
     */
    InteractionManager.prototype.normalizeToPointerData = function (event) {
        var normalizedEvents = [];
        if (this.supportsTouchEvents && event instanceof TouchEvent) {
            for (var i = 0, li = event.changedTouches.length; i < li; i++) {
                var touch = event.changedTouches[i];
                if (typeof touch.button === 'undefined')
                    { touch.button = event.touches.length ? 1 : 0; }
                if (typeof touch.buttons === 'undefined')
                    { touch.buttons = event.touches.length ? 1 : 0; }
                if (typeof touch.isPrimary === 'undefined') {
                    touch.isPrimary = event.touches.length === 1 && event.type === 'touchstart';
                }
                if (typeof touch.width === 'undefined')
                    { touch.width = touch.radiusX || 1; }
                if (typeof touch.height === 'undefined')
                    { touch.height = touch.radiusY || 1; }
                if (typeof touch.tiltX === 'undefined')
                    { touch.tiltX = 0; }
                if (typeof touch.tiltY === 'undefined')
                    { touch.tiltY = 0; }
                if (typeof touch.pointerType === 'undefined')
                    { touch.pointerType = 'touch'; }
                if (typeof touch.pointerId === 'undefined')
                    { touch.pointerId = touch.identifier || 0; }
                if (typeof touch.pressure === 'undefined')
                    { touch.pressure = touch.force || 0.5; }
                if (typeof touch.twist === 'undefined')
                    { touch.twist = 0; }
                if (typeof touch.tangentialPressure === 'undefined')
                    { touch.tangentialPressure = 0; }
                // TODO: Remove these, as layerX/Y is not a standard, is deprecated, has uneven
                // support, and the fill ins are not quite the same
                // offsetX/Y might be okay, but is not the same as clientX/Y when the canvas's top
                // left is not 0,0 on the page
                if (typeof touch.layerX === 'undefined')
                    { touch.layerX = touch.offsetX = touch.clientX; }
                if (typeof touch.layerY === 'undefined')
                    { touch.layerY = touch.offsetY = touch.clientY; }
                // mark the touch as normalized, just so that we know we did it
                touch.isNormalized = true;
                normalizedEvents.push(touch);
            }
        }
        // apparently PointerEvent subclasses MouseEvent, so yay
        else if (!self.MouseEvent
            || (event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof self.PointerEvent)))) {
            var tempEvent = event;
            if (typeof tempEvent.isPrimary === 'undefined')
                { tempEvent.isPrimary = true; }
            if (typeof tempEvent.width === 'undefined')
                { tempEvent.width = 1; }
            if (typeof tempEvent.height === 'undefined')
                { tempEvent.height = 1; }
            if (typeof tempEvent.tiltX === 'undefined')
                { tempEvent.tiltX = 0; }
            if (typeof tempEvent.tiltY === 'undefined')
                { tempEvent.tiltY = 0; }
            if (typeof tempEvent.pointerType === 'undefined')
                { tempEvent.pointerType = 'mouse'; }
            if (typeof tempEvent.pointerId === 'undefined')
                { tempEvent.pointerId = MOUSE_POINTER_ID; }
            if (typeof tempEvent.pressure === 'undefined')
                { tempEvent.pressure = 0.5; }
            if (typeof tempEvent.twist === 'undefined')
                { tempEvent.twist = 0; }
            if (typeof tempEvent.tangentialPressure === 'undefined')
                { tempEvent.tangentialPressure = 0; }
            // mark the mouse event as normalized, just so that we know we did it
            tempEvent.isNormalized = true;
            normalizedEvents.push(tempEvent);
        }
        else {
            normalizedEvents.push(event);
        }
        return normalizedEvents;
    };
    /**
     * Destroys the interaction manager
     *
     */
    InteractionManager.prototype.destroy = function () {
        this.removeEvents();
        this.removeTickerListener();
        this.removeAllListeners();
        this.renderer = null;
        this.mouse = null;
        this.eventData = null;
        this.interactionDOMElement = null;
        this.onPointerDown = null;
        this.processPointerDown = null;
        this.onPointerUp = null;
        this.processPointerUp = null;
        this.onPointerCancel = null;
        this.processPointerCancel = null;
        this.onPointerMove = null;
        this.processPointerMove = null;
        this.onPointerOut = null;
        this.processPointerOverOut = null;
        this.onPointerOver = null;
        this.search = null;
    };
    return InteractionManager;
}(EventEmitter));

Renderer.registerPlugin('batch', BatchRenderer);
Renderer.registerPlugin('interaction', InteractionManager);

class ChartApp {
    
     __init() {this.stage = new Container();}

    constructor(canvasOrId) {ChartApp.prototype.__init.call(this);
        const view = canvasOrId instanceof HTMLCanvasElement
                ? canvasOrId
                : document.querySelector(canvasOrId);

        const scale = window.devicePixelRatio;
        this.renderer = new Renderer({
            view,
            width: view.clientWidth * scale,
            height: view.clientHeight * scale,
        });

        this.draw = this.draw.bind(this);
        this.onChartUpdate = this.onChartUpdate.bind(this);
        this.removeChart = this.removeChart.bind(this);
    }

     onChartUpdate(chart) {
        this.draw();
    }

     addChart(chart, name = 'chart_' + this.stage.children.length) {
        if (this.stage.children.includes(chart)) {
            return  chart;
        }

        chart.name = name;

        this._bindEvents(chart);

        this.stage.addChild(chart);

        this.draw();

        return chart;
    }

     removeChart(name) {
        const chart = this.stage.children.find( (e) => e.name === name) ;

        if (chart) {
            this._unbindEvents(chart);
            this.stage.removeChild(chart);
            this.draw();
        }


        return chart;
    }

     _unbindEvents (chart) {
        chart.off(CHART_EVENTS.UPDATE, this.onChartUpdate);
        chart.off(CHART_EVENTS.DESTROY, this.removeChart);
    }

     _bindEvents (chart) {
        chart.on(CHART_EVENTS.UPDATE, this.onChartUpdate);
        chart.on(CHART_EVENTS.DESTROY, this.removeChart);
    }

     draw() {
        this.renderer.render(this.stage);
    }
}

export { CHART_EVENTS, CHART_TYPE, Chart, ChartApp };
//# sourceMappingURL=pixi-charts.es.js.map
