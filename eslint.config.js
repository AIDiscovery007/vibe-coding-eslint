// ============================================================
// ⚡ ESLint Flat Config (v9+)
//
// 📖 教学说明：
//    ESLint 9 引入了 "Flat Config" 格式，取代了 .eslintrc.*
//    它就是一个普通的 JS 数组，每个元素是一个配置对象。
//    
//    配置对象的结构：
//    {
//      files: ['匹配模式'],     // 对哪些文件生效
//      plugins: { 插件名: 插件对象 },  // 注册插件
//      rules: { '插件名/规则名': '级别' }, // 启用规则
//    }
//
//    规则级别：
//    'off'   / 0 = 关闭
//    'warn'  / 1 = 警告（不阻断）
//    'error' / 2 = 错误（会导致 lint 失败，可以阻断 CI）
// ============================================================

const architecturePlugin = require('./eslint-rules/index.js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
  // ——————————————————————————————————————————————
  // 配置1：JS 文件 → 自定义架构规则
  // ——————————————————————————————————————————————
  {
    files: ['src/**/*.js'],
    
    plugins: {
      architecture: architecturePlugin,
    },
    
    rules: {
      'architecture/no-cross-layer-import': 'error',
      'architecture/enforce-layer-naming': 'warn',
      'architecture/no-console-in-data-layer': 'error',
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },

  // ——————————————————————————————————————————————
  // 配置2：TS 文件 → 类型约束规则
  //
  // 📖 教学说明：
  //    这部分展示了"类型系统约束编码化"
  //    TypeScript 本身只保证类型正确性，
  //    但 Linter 可以更进一步：
  //    - 禁止使用 any（不允许偷懒）
  //    - 强制写类型注解（不允许省略）
  //    - 强制写返回类型（不允许依赖推断）
  // ——————————————————————————————————————————————
  {
    files: ['src-ts/**/*.ts'],

    plugins: {
      // 注册自定义架构规则（对 TS 同样生效）
      architecture: architecturePlugin,
      // 注册 @typescript-eslint 插件
      '@typescript-eslint': tseslint,
    },

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      // ═══════════════════════════════════════════
      // 🔒 类型严格性规则
      // ═══════════════════════════════════════════

      // 规则1: 禁止显式 any
      // ❌ function foo(data: any) {}
      // ✅ function foo(data: unknown) {}
      // ✅ function foo(data: Record<string, string>) {}
      '@typescript-eslint/no-explicit-any': 'error',

      // 规则2: 强制参数/返回值写类型注解
      // ❌ function foo(id) {}
      // ❌ export function bar(name: string) { return 1; }
      // ✅ function foo(id: number): User {}
      '@typescript-eslint/typedef': ['warn', {
        parameter: true,              // 函数参数必须标类型
        propertyDeclaration: true,    // 属性声明必须标类型
      }],

      // 规则3: 导出函数必须显式写返回类型
      // ❌ export function getUser(id: number) { return ... }
      // ✅ export function getUser(id: number): User { return ... }
      //
      // 📖 为什么这很重要？
      //    虽然 TypeScript 能自动推断返回类型，
      //    但显式写出来有两个好处：
      //    a) 函数签名就是文档，一眼能看出返回什么
      //    b) 防止内部实现改变后返回类型悄悄变了
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,             // 允许箭头函数回调省略
        allowedNames: [],
      }],

      // ═══════════════════════════════════════════
      // 🏗️ 同时启用架构规则（TS 文件也要守规矩）
      // ═══════════════════════════════════════════
      'architecture/no-cross-layer-import': 'error',
      'architecture/enforce-layer-naming': 'warn',
      'architecture/no-console-in-data-layer': 'error',
    },
  },
];
