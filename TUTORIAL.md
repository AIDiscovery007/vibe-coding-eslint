# 约束编码化实战教程：用 ESLint 自定义规则强制架构约束

> "写在文档里的规范很容易被忽略，编码进 Linter 的约束才具备可执行性"

## 项目结构总览

```
learn-eslint/
├── eslint.config.js           ← ESLint 配置（Flat Config 格式）
├── eslint-rules/              ← 🔧 自定义规则（核心！）
│   ├── index.js               ←   插件入口
│   ├── no-cross-layer-import.js  ← 规则1：禁止跨层引用
│   ├── enforce-layer-naming.js   ← 规则2：强制命名约定
│   └── __tests__/             ←   规则的单元测试
│       └── no-cross-layer-import.test.js
├── src/                       ← 模拟业务代码（三层架构）
│   ├── data/                  ←   📦 数据层
│   │   ├── userRepository.js
│   │   └── orderRepository.js
│   ├── service/               ←   ⚙️ 服务层
│   │   ├── userService.js
│   │   └── orderService.js
│   └── ui/                    ←   🖼️ UI层
│       ├── UserProfile.js     ←   ✅ 合规代码
│       ├── OrderList.js       ←   ❌ 含违规引用
│       └── BadExample.js      ←   ❌ 多种违规示例
└── package.json
```

## 快速体验

```bash
# 1. 运行 lint，查看违规检测
npm run lint

# 2. 运行规则单元测试
node eslint-rules/__tests__/no-cross-layer-import.test.js
```

## 核心知识点

### 1. ESLint 规则的本质 = AST 访问者模式
- ESLint 把源代码解析成 AST（抽象语法树）
- 每条规则是一个"访问者"，声明自己关心哪种节点
- ESLint 遍历 AST 时，把节点分发给对应的规则检查

### 2. 规则的标准结构
```js
module.exports = {
  meta: {
    type: 'problem',          // 错误类型
    docs: { description: '' }, // 文档
    messages: { id: '模板' },  // 错误消息
  },
  create(context) {            // 规则逻辑
    return {
      ImportDeclaration(node) { // 访问 import 节点
        context.report({ ... }); // 报告错误
      },
    };
  },
};
```

### 3. Flat Config 配置方式（ESLint 9+）
```js
module.exports = [{
  files: ['src/**/*.js'],
  plugins: { myPlugin: require('./my-rules') },
  rules: { 'myPlugin/my-rule': 'error' },
}];
```

### 4. 约束编码化 vs 文档化

| 维度 | 文档化 | 编码化 |
|------|--------|--------|
| 执行力 | 靠人工自觉 | 机器强制执行 |
| 新人培训 | 需要读文档 | 写错直接报错 |
| 持续性 | 容易被遗忘 | 每次保存/CI 都检查 |
| 可扩展 | 改文档 | 改规则代码 |
| Agent 友好 | Agent 不读文档 | Agent 写的代码也被约束 |

## 动手练习建议

1. **修改约束关系**：试试让 `service` 层也禁止互相引用
2. **添加新规则**：比如"data 层禁止使用 console.log"
3. **接入 CI**：在 `package.json` 的 CI 脚本中加入 `npm run lint`
4. **探索 AST**：访问 https://astexplorer.net 粘贴代码查看 AST 结构
