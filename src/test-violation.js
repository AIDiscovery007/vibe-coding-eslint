// 测试违反跨层引用规范：从 ui 层直接调用 data 层
import { userRepository } from '../data/userRepository';

console.log(userRepository);
