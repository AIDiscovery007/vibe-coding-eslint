// ============================================================
// 🧪 规则单元测试
//
// 📖 教学说明：
//    ESLint 提供了 RuleTester 工具来测试自定义规则。
//    你只需要提供：
//    - valid:   应该通过检查的代码列表
//    - invalid: 应该报错的代码列表（需指定期望的错误）
//
//    这是 TDD（测试驱动开发）的最佳实践：
//    先写测试用例，定义"什么是对的、什么是错的"，
//    然后再实现规则逻辑。
// ============================================================

const { RuleTester } = require('eslint');
const rule = require('../no-cross-layer-import');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-cross-layer-import', rule, {
  // ✅ 这些代码应该通过检查（不报错）
  valid: [
    {
      // UI层引用 Service层 → 合法
      code: "import { getUserDetail } from '../service/userService.js';",
      filename: '/project/src/ui/UserProfile.js',
    },
    {
      // Service层引用 Data层 → 合法
      code: "import { queryUserById } from '../data/userRepository.js';",
      filename: '/project/src/service/userService.js',
    },
    {
      // 非分层目录中的文件 → 跳过检查
      code: "import { anything } from '../data/foo.js';",
      filename: '/project/src/utils/helper.js',
    },
  ],

  // ❌ 这些代码应该报错
  invalid: [
    {
      // UI层直接引用 Data层 → 报错！
      code: "import { queryUserById } from '../data/userRepository.js';",
      filename: '/project/src/ui/UserProfile.js',
      errors: [{ messageId: 'forbidden' }],
    },
    {
      // Data层引用 Service层 → 报错！
      code: "import { getUserDetail } from '../service/userService.js';",
      filename: '/project/src/data/userRepository.js',
      errors: [{ messageId: 'forbidden' }],
    },
    {
      // Data层引用 UI层 → 报错！
      code: "import { renderUserProfile } from '../ui/UserProfile.js';",
      filename: '/project/src/data/userRepository.js',
      errors: [{ messageId: 'forbidden' }],
    },
  ],
});

console.log('✅ no-cross-layer-import: 所有测试通过！');
