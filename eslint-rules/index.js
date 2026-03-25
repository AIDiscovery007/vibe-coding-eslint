// ============================================================
// 📦 本地 ESLint 插件入口
//
// 📖 教学说明：
//    ESLint 9 使用 Flat Config（扁平配置），不再需要发布 npm 包。
//    我们可以直接在项目中定义规则，然后在 eslint.config.js 中引用。
//
//    一个 ESLint 插件的最小结构就是：
//    { rules: { '规则名': 规则对象 } }
// ============================================================

const noCrossLayerImport = require('./no-cross-layer-import');
const enforceLayerNaming = require('./enforce-layer-naming');
const noConsoleInDataLayer = require('./no-console-in-data-layer');

// 导出为一个 ESLint 插件对象
module.exports = {
  rules: {
    'no-cross-layer-import': noCrossLayerImport,
    'enforce-layer-naming': enforceLayerNaming,
    'no-console-in-data-layer': noConsoleInDataLayer,
  },
};
