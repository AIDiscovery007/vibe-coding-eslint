// ============================================================
// 🔧 自定义规则 #3：no-console-in-data-layer
//
// 📖 来源：一句自然语言描述
//    "data 层不允许使用 console.log，应该走统一的 logger"
//
// 💡 这就是「AI + Linter」工作流的产物：
//    人类用自然语言描述意图 → AI 翻译成 AST 访问规则
// ============================================================

function detectLayer(filePath) {
  const match = filePath.match(/src\/(ui|service|data)\//);
  return match ? match[1] : null;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'data 层禁止直接使用 console，应使用统一的 logger 模块',
    },
    messages: {
      noConsole:
        '🚫 data 层禁止使用 console.{{method}}()。' +
        '请使用 logger 模块：import { logger } from "../../utils/logger.js"',
    },
    schema: [],
  },

  create(context) {
    const layer = detectLayer(context.filename);

    // 只对 data 层生效
    if (layer !== 'data') {
      return {};
    }

    return {
      // =====================================================
      // 📌 访问 CallExpression 节点
      //
      // console.log('hello') 的 AST 结构：
      // {
      //   type: 'CallExpression',
      //   callee: {
      //     type: 'MemberExpression',
      //     object: { type: 'Identifier', name: 'console' },
      //     property: { type: 'Identifier', name: 'log' }
      //   }
      // }
      // =====================================================
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'console'
        ) {
          context.report({
            node,
            messageId: 'noConsole',
            data: {
              method: callee.property.name || 'log',
            },
          });
        }
      },
    };
  },
};
