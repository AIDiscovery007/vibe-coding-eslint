# 约束编码化：用 Linter + 类型系统替代文档规范

> 时间：2026-03-24
> 项目：learn-eslint（实战教学 Demo）

## 一、核心理念

**写在文档里的规范会被忽略，编码进 Linter/类型系统的约束才可执行。**

- 架构分层靠自定义 Linter 规则机械强制，不靠人工 Review
- 规范的最佳载体是代码本身，而非 Confluence/语雀文档
- 对 AI 编码尤其重要：AI 不会主动读架构文档，但 AI 生成的代码一定会经过 Linter 检查

## 二、AI + Linter 工作流

```
讨论架构（人 ↔ AI）→ AI 生成 Lint 规则 → 编码即生效 → 机器强制执行
```

关键价值：规范的唯一产出物就是可执行代码，不存在"没人看"的问题。AI 违规 → Linter 报错 → AI 根据报错自动修正 → 形成自修正闭环。

## 三、反馈链路（从快到慢 4 层）

| 层级 | 触发时机 | 配置方式 | 作用 |
|------|---------|---------|------|
| 第1层：IDE 实时标红 | 每次击键（毫秒级） | `.vscode/settings.json` + ESLint 扩展 | 红/黄波浪线即时提醒 |
| 第2层：保存自动修复 | Cmd+S（秒级） | `codeActionsOnSave` | 能自动修的直接修掉 |
| 第3层：Git 提交拦截 | git commit（秒级） | husky + lint-staged | 有 error 则阻止提交 |
| 第4层：CI 流水线兜底 | push/MR（分钟级） | CI 配置 | 最终安全网 |

**核心结论：Linter 不是"写完跑一次"的工具，而是像编译器一样始终在后台运行的守护进程。**

## 四、自定义 ESLint 规则的核心知识

### 原理：AST 访问者模式
ESLint 将源代码解析为 AST（抽象语法树），每条规则是一个"访问者"，声明关心哪种节点类型，ESLint 遍历 AST 时将节点分发给规则检查。

### 规则标准结构
```js
module.exports = {
  meta: {
    type: 'problem',             // 'problem' | 'suggestion' | 'layout'
    docs: { description: '' },
    messages: { msgId: '模板 {{var}}' },
  },
  create(context) {
    return {
      ImportDeclaration(node) {   // 访问 import 语句节点
        context.report({ node, messageId: 'msgId', data: { var: 'value' } });
      },
    };
  },
};
```

### 常用 AST 节点类型
- `ImportDeclaration` → import 语句（检查依赖关系/分层约束）
- `ExportNamedDeclaration` → 命名导出（检查命名规范）
- `CallExpression` → 函数调用（检查禁用 API，如 console.log）
- `FunctionDeclaration` → 函数声明（检查函数签名）

### 本地插件结构（ESLint 9 Flat Config，无需发 npm 包）
```js
// eslint-rules/index.js
module.exports = {
  rules: {
    'rule-name': require('./rule-name'),
  },
};

// eslint.config.js
const myPlugin = require('./eslint-rules/index.js');
module.exports = [{
  files: ['src/**/*.js'],
  plugins: { myPlugin },
  rules: { 'myPlugin/rule-name': 'error' },
}];
```

## 五、tsc 与 Linter 的分工

| 维度 | TypeScript 编译器 (tsc) | ESLint + @typescript-eslint |
|------|------------------------|---------------------------|
| 职责 | 管"类型对不对" | 管"写没写"、"偷没偷懒" |
| any | 合法语法，放行 | `no-explicit-any` → 禁止 |
| 参数类型省略 | strict 模式报错 | `typedef` → 双重保障 |
| 返回类型省略 | 能推断就放行 | `explicit-function-return-type` → 强制写 |

两者组合 = 既保证类型正确，又保证不偷懒。

### 关键 @typescript-eslint 规则
```js
rules: {
  '@typescript-eslint/no-explicit-any': 'error',          // 禁止 any
  '@typescript-eslint/typedef': ['warn', {
    parameter: true,
    propertyDeclaration: true,
  }],
  '@typescript-eslint/explicit-function-return-type': ['warn', {
    allowExpressions: true,
  }],
}
```

## 六、本 Demo 中实现的 3 条自定义规则

| 规则 | 约束内容 | AST 节点 |
|------|---------|---------|
| `no-cross-layer-import` | UI层禁引Data层，Data层禁引上层 | `ImportDeclaration` |
| `enforce-layer-naming` | 各层导出函数必须以指定前缀开头 | `ExportNamedDeclaration` |
| `no-console-in-data-layer` | Data层禁用 console | `CallExpression` |

## 七、IDE 配置要点

```jsonc
// .vscode/settings.json
{
  "eslint.useFlatConfig": true,
  "eslint.validate": ["javascript", "typescript"],  // 必须显式加 typescript
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
}
```

需安装扩展：`dbaeumer.vscode-eslint`。配置变更后执行 `ESLint: Restart ESLint Server`。

## 八、AST 探索工具

https://astexplorer.net — 粘贴代码即可可视化 AST 结构，写规则前先在这里确认节点类型。
