// ============================================================
// 🔧 自定义 ESLint 规则 #2：enforce-layer-naming
//
// 📖 教学重点：用 Lint 强制命名约定
//    - data 层导出函数必须以 query/save/insert/update/delete 开头
//    - service 层导出函数必须以 get/create/update/delete/check 开头
//    - ui 层导出函数必须以 render/handle/on 开头
//
// 🧠 为什么这很重要？
//    命名约定如果只写在文档里，3个月后没人记得。
//    编码成 Lint 规则后，每次保存文件都会自动提醒，
//    新人入职第一天就能被"教会"。
// ============================================================

const NAMING_RULES = {
  data: {
    prefixes: ['query', 'save', 'insert', 'update', 'delete', 'find', 'count'],
    description: '数据层函数应以 query/save/insert/update/delete/find/count 开头',
  },
  service: {
    prefixes: ['get', 'create', 'update', 'delete', 'check', 'register', 'validate'],
    description: '服务层函数应以 get/create/update/delete/check/register/validate 开头',
  },
  ui: {
    prefixes: ['render', 'handle', 'on', 'show', 'hide', 'toggle'],
    description: 'UI层函数应以 render/handle/on/show/hide/toggle 开头',
  },
};

function detectLayer(filePath) {
  const match = filePath.match(/src\/(ui|service|data)\//);
  return match ? match[1] : null;
}

module.exports = {
  meta: {
    type: 'suggestion',  // 'suggestion' = 建议改进，不像 'problem' 那么严格
    docs: {
      description: '强制各层导出函数遵循命名约定',
    },
    messages: {
      badName:
        '⚠️ 命名违规: {{layer}}层的导出函数 "{{name}}" 不符合约定。' +
        '{{rule}}',
    },
    schema: [],
  },

  create(context) {
    const layer = detectLayer(context.filename);
    if (!layer || !NAMING_RULES[layer]) {
      return {};
    }

    const { prefixes, description } = NAMING_RULES[layer];

    // =====================================================
    // 📌 这里我们需要检查两种 AST 节点：
    //
    // 1. export function getUserDetail() {}
    //    → ExportNamedDeclaration > FunctionDeclaration
    //
    // 2. export default function render() {}
    //    → ExportDefaultDeclaration > FunctionDeclaration
    // =====================================================

    /**
     * 检查函数名是否符合前缀规则
     */
    function checkFunctionName(node, funcName) {
      if (!funcName) return; // 匿名函数跳过

      const isValid = prefixes.some(prefix => 
        funcName.startsWith(prefix)
      );

      if (!isValid) {
        context.report({
          node,
          messageId: 'badName',
          data: {
            layer,
            name: funcName,
            rule: description,
          },
        });
      }
    }

    return {
      // =====================================================
      // 📌 ExportNamedDeclaration: 处理命名导出
      //
      // export function foo() {}   ← declaration 是 FunctionDeclaration
      // export const bar = () => {} ← declaration 是 VariableDeclaration
      // =====================================================
      ExportNamedDeclaration(node) {
        const decl = node.declaration;
        if (!decl) return;

        // 情况1: export function xxx() {}
        if (decl.type === 'FunctionDeclaration' && decl.id) {
          checkFunctionName(decl, decl.id.name);
        }

        // 情况2: export const xxx = () => {}
        if (decl.type === 'VariableDeclaration') {
          for (const varDecl of decl.declarations) {
            if (
              varDecl.init &&
              (varDecl.init.type === 'ArrowFunctionExpression' ||
               varDecl.init.type === 'FunctionExpression') &&
              varDecl.id
            ) {
              checkFunctionName(varDecl, varDecl.id.name);
            }
          }
        }
      },
    };
  },
};
