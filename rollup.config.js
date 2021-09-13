const main = require("@pixi-build-tools/rollup-configurator/main");

module.exports = main.main({
    excludedExternals: ['color-parse', 'nice-ticks']
});
