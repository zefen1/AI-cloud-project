# TravelCheck 智能合约

## 概述

TravelCheck DApp 的智能合约系统包含三个核心合约：

1. **DailyCheckIn.sol** - 每日打卡质押和奖励系统
2. **SpotCheckIn.sol** - 景点打卡任务系统
3. **Lottery.sol** - 幸运转盘抽奖系统

## 合约架构

```
TravelCheck 合约系统
├── DailyCheckIn.sol
│   ├── 质押功能
│   ├── 打卡功能
│   ├── 补卡功能
│   ├── 提取功能
│   └── 利息计算
├── SpotCheckIn.sol
│   ├── 任务创建
│   ├── 任务参与
│   ├── 打卡提交
│   ├── 审核机制
│   └── 奖励领取
└── Lottery.sol
    ├── 转盘抽奖
    ├── 次数管理
    ├── 奖品发放
    └── 历史记录
```

## DailyCheckIn 合约

### 主要功能

#### 1. 质押 (stake)

```solidity
function stake(uint256 amount, uint8 milestoneDays, bool isLocked) external
```

**参数**：
- `amount`: 质押金额（1-1000 代币）
- `milestoneDays`: 里程碑天数（30/100/200/365）
- `isLocked`: 是否锁定模式

**里程碑和利息**：
- 封存模式：5% 年化利息
- 随时可取：2.5% 年化利息

#### 2. 打卡 (checkIn)

```solidity
function checkIn(string memory content) external
```

**要求**：
- 内容不少于 200 字
- 每天只能打卡一次
- 连续打卡不能中断（否则需要补卡）

**奖励**：
- 随机红包：5-50 代币
- 每日利息累计

#### 3. 补卡 (makeUp)

```solidity
function makeUp(uint8 taskType, string memory content) external
```

**任务类型**：
1. 双倍攻略（400字）
2. 精品图文（300字）
3. 视频打卡（200字）

**限制**：
- 最多 3 次补卡机会

#### 4. 提取 (withdraw)

```solidity
function withdraw() external
```

**条件**：
- 封存模式：必须完成里程碑
- 随时可取：随时可以提取

**返回**：
- 本金 + 累计利息 + 累计红包

### 数据结构

```solidity
struct Stake {
    uint256 amount;              // 质押金额
    uint8 milestoneDays;         // 里程碑天数
    bool isLocked;               // 是否锁定
    uint256 startTime;           // 开始时间
    uint256 currentDay;          // 当前天数
    uint256 lastCheckInTime;     // 最后打卡时间
    uint256 earnedInterest;      // 累计利息
    uint256 redPackets;          // 累计红包
    uint256 missedDays;          // 断卡天数
    uint256 remainingMakeups;    // 剩余补卡次数
    bool completed;              // 是否完成
}
```

## SpotCheckIn 合约

### 主要功能

#### 1. 创建任务 (createTask)

```solidity
function createTask(
    string memory name,
    string memory location,
    string memory description,
    uint256 minStake,
    uint256 maxStake,
    uint256 dailyInterest,
    uint256 totalReward,
    uint256 deadline
) external
```

#### 2. 参与任务 (joinTask)

```solidity
function joinTask(uint256 taskId, uint256 amount) external
```

**要求**：
- 质押金额在 minStake 和 maxStake 之间
- 任务未过期
- 用户未参与过该任务

#### 3. 提交打卡 (submitCheckIn)

```solidity
function submitCheckIn(
    uint256 taskId,
    string[] memory photos,
    string memory verificationCode
) external
```

**要求**：
- 上传 3-5 张照片
- 输入验证码
- 自动计算利息收益

#### 4. 审核打卡 (approveCheckIn)

```solidity
function approveCheckIn(address user, uint256 taskId) external
```

#### 5. 领取奖励 (claimReward)

```solidity
function claimReward(uint256 taskId) external
```

**返回**：
- 本金 + 利息 + 任务奖励

## Lottery 合约

### 主要功能

#### 1. 抽奖 (spin)

```solidity
function spin() external returns (uint256 prizeIndex, Prize memory prize)
```

**奖品池**：
- 💎 100代币（稀有）
- 💰 50代币（普通）
- 💸 20代币（常见）
- 💵 10代币（常见）
- 🔄 补卡次数 x2（普通）
- 🏆 专属徽章（稀有）
- 😊 谢谢参与

#### 2. 奖励次数 (awardSpins)

```solidity
function awardSpins(address user, uint256 amount) external
```

**获得途径**：
- 完成每日打卡：+1 次
- 完成景点打卡：+2 次
- 达成里程碑：+5 次

## 部署说明

### 环境要求

- Solidity 0.8.20+
- Hardhat / Foundry
- Node.js 18+

### 部署步骤

1. 编译合约：
```bash
npx hardhat compile
```

2. 部署到测试网：
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

3. 验证合约：
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 安全考虑

### 已实现

- ✅ 金额范围检查
- ✅ 状态验证
- ✅ 重入保护（通过状态更新顺序）
- ✅ 权限检查

### 待优化

- ⚠️ 使用 Chainlink VRF 替代伪随机数
- ⚠️ 添加访问控制（Ownable/AccessControl）
- ⚠️ 添加暂停机制（Pausable）
- ⚠️ 审核机制改为预言机或多签
- ⚠️ 内容存储使用 IPFS
- ⚠️ 添加升级机制（UUPS/Transparent Proxy）

## Gas 优化

- 使用 `calldata` 替代 `memory`（外部函数）
- 打包存储变量
- 批量操作
- 事件日志替代存储

## 测试覆盖

建议测试用例：

- [ ] 质押功能测试
- [ ] 打卡流程测试
- [ ] 补卡机制测试
- [ ] 提取功能测试
- [ ] 景点任务测试
- [ ] 抽奖功能测试
- [ ] 边界条件测试
- [ ] 安全性测试

## Mock 数据

在前端开发阶段，使用 `lib/mock/contracts.ts` 模拟合约调用：

```typescript
import { mockDailyCheckIn } from '@/lib/mock/contracts';

// 质押
await mockDailyCheckIn.stake(100, 30, true);

// 打卡
const redPacket = await mockDailyCheckIn.checkIn('旅行攻略内容...');

// 查询
const stakeInfo = mockDailyCheckIn.getStakeInfo();
```

## 许可证

MIT License
