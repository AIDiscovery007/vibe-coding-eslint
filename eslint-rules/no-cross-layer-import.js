// ============================================================
// 🔧 自定义 ESLint 规则 #1：no-cross-layer-import
// 
// 📖 教学重点：这就是"约束编码化"的核心！
//    我们把"UI层不能直接引用Data层"这条架构规范
//    从文档/口头约定 → 编码成可自动执行的 Lint 规则
//
// 🧠 核心概念：
//    ESLint 规则本质上是一个"AST 访问者"(Visitor)
//    ESLint 会把源代码解析成 AST（抽象语法树），
//    然后让每条规则去"访问"它感兴趣的节点。
//
//    import { foo } from '../data/xxx'  
//    这行代码在 AST 中是一个 ImportDeclaration 节点，
//    我们只需要检查它的 source.value（导入路径）即可。
// ============================================================

/**
 * 架构分层规则定义：
 * key   = 当前文件所在层
 * value = 该层被禁止引用的层列表
 */
const LAYER_CONSTRAINTS = {
  ui:      ['data'],          // UI 层禁止直接引用 Data 层
  service: ['ui'],            // Service 层禁止引用 UI 层（反向依赖）
  data:    ['ui', 'service'], // Data 层禁止引用上层（保持纯净）
};

/**
 * 从文件路径中提取它属于哪个"层"
 * 例如: '/project/src/ui/UserProfile.js' → 'ui'
 */
function detectLayer(filePath) {
  // 用正则匹配 src/ 后面的第一个目录名
  const match = filePath.match(/src\/(ui|service|data)\//);
  return match ? match[1] : null;
}

/**
 * 从 import 路径中提取它引用的目标"层"
 * 例如: '../data/userRepository' → 'data'
 */
function detectImportLayer(importPath) {
  const match = importPath.match(/\/(ui|service|data)\//);
  return match ? match[1] : null;
}

// ============================================================
// 📐 ESLint 规则的标准结构（必须遵循这个格式）
// ============================================================
module.exports = {
  // ——— meta: 规则的元信息 ———
  meta: {
    type: 'problem',  // 'problem' | 'suggestion' | 'layout'
                      // problem = 代码错误，最严格
    docs: {
      description: '禁止跨架构层级的 import 引用',
      // 教学说明：这里描述规则的用途，会显示在文档/IDE提示中
    },
    messages: {
      // 教学说明：预定义错误消息模板，用 {{xxx}} 做变量插值
      forbidden: 
        '🚫 架构违规: {{currentLayer}} 层禁止直接引用 {{targetLayer}} 层！' +
        '请通过 service 层中转。' +
        '(import: "{{importPath}}")',
    },
    schema: [],  // 这条规则不需要额外配置项
  },

  // ——— create: 规则的核心逻辑 ———
  // 返回一个"访问者对象"，key 是 AST 节点类型
  create(context) {
    // context.filename 是当前被检查的文件路径
    const currentLayer = detectLayer(context.filename);

    // 如果文件不在我们定义的分层目录中，跳过检查
    if (!currentLayer) {
      return {};
    }

    const forbidden = LAYER_CONSTRAINTS[currentLayer] || [];

    return {
      // =====================================================
      // 📌 关键：访问 ImportDeclaration 节点
      //
      // 当 ESLint 遍历 AST 时，每遇到一个 import 语句，
      // 就会调用这个函数，把该节点传给我们检查
      //
      // AST 结构示例 (import { foo } from '../data/bar'):
      // {
      //   type: 'ImportDeclaration',
      //   source: { type: 'Literal', value: '../data/bar' },
      //   specifiers: [{ local: { name: 'foo' } }]
      // }
      // =====================================================
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const targetLayer = detectImportLayer(importPath);

        // 如果引用目标是被禁止的层 → 报错！
        if (targetLayer && forbidden.includes(targetLayer)) {
          context.report({
            node,                              // 标记出错的位置
            messageId: 'forbidden',            // 使用预定义的消息模板
            data: {                            // 填充模板变量
              currentLayer,
              targetLayer,
              importPath,
            },
          });
        }
      },
    };
  },
};
