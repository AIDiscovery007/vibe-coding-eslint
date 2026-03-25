// 违反规范：UI 层直接引用 Data 层（应该通过 service 中转）
import { userRepository } from '../data/userRepository';

console.log(userRepository);
