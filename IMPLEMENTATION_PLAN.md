# TravelCheck DApp 实现计划

## 📋 项目概述

基于 prd/home.png UI 设计、prd/code.html 设计规范和打卡.md 需求文档，实现旅游打卡 DApp。

---

## 🎨 设计规范提取

### 配色方案
- **主色**: `#25f478` (霓虹绿)
- **主色悬停**: `#1ee06a`
- **背景深色**: `#102217`
- **玻璃效果**: `rgba(16, 34, 23, 0.6)`

### 字体
- **Display**: Space Grotesk (标题)
- **Body**: Noto Sans (正文)

### 设计风格
- 玻璃拟态 (Glassmorphism)
- 霓虹发光效果
- 暗黑主题
- 流畅动画过渡

---

## 📦 第一阶段：基础设施搭建

### 1.1 项目结构调整
```
travel-check-dapp/
├── app/
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   ├── daily-checkin/       # 每日打卡模块
│   │   ├── page.tsx
│   │   ├── stake/           # 质押页面
│   │   └── calendar/        # 日历页面
│   ├── spot-checkin/        # 景点打卡模块
│   │   ├── page.tsx
│   │   └── [taskId]/
│   ├── rewards/             # 奖励中心
│   │   ├── page.tsx
│   │   └── lottery/
│   └── profile/             # 个人中心
│       └── page.tsx
├── components/
│   ├── ui/                  # UI 组件库
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── progress.tsx
│   │   └── tabs.tsx
│   ├── wallet/              # 钱包相关
│   │   ├── connect-button.tsx
│   │   └── wallet-provider.tsx
│   ├── layout/              # 布局组件
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── glass-panel.tsx
│   └── checkin/             # 打卡相关
│       ├── checkin-card.tsx
│       ├── calendar-view.tsx
│       └── red-envelope.tsx
├── lib/
│   ├── contracts/           # 智能合约 ABI & 地址
│   ├── hooks/               # 自定义 hooks
│   ├── utils/               # 工具函数
│   └── constants.ts         # 常量配置
└── styles/
    └── globals.css          # 全局样式
```

### 1.2 配置更新

**tailwind.config.ts**
```typescript
// 应用 prd/code.html 中的配色方案
theme: {
  extend: {
    colors: {
      primary: '#25f478',
      'primary-hover': '#1ee06a',
      'background-light': '#f5f8f7',
      'background-dark': '#102217',
      glass: 'rgba(16, 34, 23, 0.6)',
    },
    fontFamily: {
      display: ['Space Grotesk', 'sans-serif'],
      body: ['Noto Sans', 'sans-serif'],
    },
  }
}
```

**globals.css**
```css
/* 添加玻璃拟态效果 */
.glass-panel {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 霓虹发光动画 */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(37, 244, 120, 0.3); }
  50% { box-shadow: 0 0 25px rgba(37, 244, 120, 0.6); }
}
```

---

## 🎯 第二阶段：首页实现

### 2.1 首页布局组件

**app/page.tsx**
- Hero 区域（CAPTURE YOUR JOURNEY）
- 立即打卡按钮
- 统计数据卡片（全球参与者、里程碑达成者、今日打卡）

**components/layout/header.tsx**
- TravelCheck Logo
- Connect Wallet 按钮
- 钱包连接状态显示

**components/layout/stats-footer.tsx**
- 三个统计卡片
- 玻璃拟态效果
- Hover 动画

### 2.2 Web3 集成

**components/wallet/wallet-provider.tsx**
```typescript
// 使用 RainbowKit + wagmi
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
```

**配置钱包连接器**
- MetaMask
- WalletConnect
- Coinbase Wallet

---

## 🗓️ 第三阶段：每日打卡模块

### 3.1 质押页面 (daily-checkin/stake)

**功能组件**:
1. 质押金额输入 (1-1000 代币)
2. 里程碑选择器
   - 30天 / 100天 / 200天 / 365天
   - 显示对应利息率和徽章
3. 锁定方式切换
   - 封存模式 / 随时可取模式
   - 实时计算预期收益
4. 确认质押按钮
   - 调用智能合约
   - 展示交易状态

**UI 设计**:
- 卡片式布局
- 实时收益计算器
- 玻璃拟态效果

### 3.2 打卡日历 (daily-checkin/calendar)

**功能组件**:
1. 月历视图
   - 已打卡日期标记 ✅
   - 断卡日期标记 ❌
   - 可补卡日期标记 🔄
2. 打卡进度条
   - 当前天数 / 目标天数
   - 完成百分比
3. 补卡次数显示
   - 剩余次数 (最多3次)
4. 今日打卡入口
   - 进入任务页面

### 3.3 打卡任务页面

**功能组件**:
1. 任务类型展示
   - 发布旅游攻略 (首发)
   - 其他任务 (敬请期待)
2. 内容编辑器
   - 文本输入 (最少200字)
   - 字数统计
3. 提交按钮
   - 前端验证
   - 调用智能合约
4. 红包弹窗
   - 打卡成功后显示
   - 红包金额计算
   - 领取按钮

### 3.4 补卡流程

**功能组件**:
1. 补卡入口
   - 日历页断卡标记
2. 补卡任务选择
   - 双倍攻略 / 精品图文 / 视频打卡
   - 难度标识
3. 任务完成
   - 审核流程
4. 补卡成功反馈

---

## 📍 第四阶段：景点打卡模块

### 4.1 景点任务列表 (spot-checkin)

**功能组件**:
1. 任务卡片
   - 景点名称、图片
   - 任务期限
   - 质押要求
   - 奖励说明
2. 筛选和排序
   - 按地区筛选
   - 按奖励排序
3. 参与按钮
   - 跳转任务详情

### 4.2 景点任务详情

**功能组件**:
1. 任务信息
   - 景点介绍
   - 打卡要求
   - 验证流程
2. 质押操作
   - 金额输入
   - 质押确认
3. 打卡操作
   - 上传照片
   - 输入验证 Key
   - 提交审核
4. 奖励领取
   - 完成后领取
   - 每日利息显示

### 4.3 我的景点任务

**功能组件**:
1. 任务列表
   - 进行中 / 已完成 / 已失败
2. 任务详情
   - 打卡记录
   - 收益统计

---

## 🎁 第五阶段：奖励系统

### 5.1 红包系统

**组件**:
- 红包弹窗动画
- 金额计算展示
- 领取倒计时 (24小时)

### 5.2 幸运转盘

**功能**:
1. 转盘 UI
   - 8个奖励格
   - 旋转动画
2. 抽奖逻辑
   - 链上随机数
   - 中奖结果展示
3. 奖品类型
   - 代币奖励
   - 补卡次数
   - 徽章

### 5.3 成就系统

**功能**:
1. 徽章展示
   - 🌱 旅行新芽
   - ⭐ 旅行达人
   - 🌟 探险家
   - 👑 旅行大师
2. 成就墙
   - 已获得 / 未获得
   - 获得条件说明

---

## 🔗 第六阶段：智能合约集成

### 6.1 合约接口设计

**DailyCheckIn.sol**
```solidity
interface IDailyCheckIn {
    function stake(uint256 amount, uint8 milestone, bool locked) external;
    function checkIn(string memory content) external;
    function claimRedPacket() external;
    function makeUp(uint8 taskType, string memory content) external;
    function withdraw() external;
}
```

**SpotCheckIn.sol**
```solidity
interface ISpotCheckIn {
    function joinTask(uint256 taskId, uint256 amount) external;
    function submitCheckIn(uint256 taskId, string memory photo, string memory key) external;
    function claimReward(uint256 taskId) external;
}
```

**Lottery.sol**
```solidity
interface ILottery {
    function spin() external returns (uint256 prize);
}
```

### 6.2 Hooks 封装

**lib/hooks/useCheckIn.ts**
```typescript
export function useDailyCheckIn() {
  const { write: stake } = useContractWrite({...});
  const { write: checkIn } = useContractWrite({...});
  // ...
}
```

**lib/hooks/useSpotCheckIn.ts**
**lib/hooks/useLottery.ts**

---

## 📊 第七阶段：数据展示

### 7.1 个人中心

**功能**:
1. 资产概览
   - 质押总额
   - 累计收益
   - 待领取奖励
2. 打卡统计
   - 连续打卡天数
   - 累计打卡次数
   - 完成的里程碑
3. 我的徽章
4. 交易历史

### 7.2 排行榜

**功能**:
1. 连续打卡排行
2. 累计收益排行
3. 里程碑达成排行

---

## 🚀 实施步骤建议

### 阶段 1: 基础 (Week 1)
- ✅ 已完成依赖安装
- [ ] 配置 Tailwind (应用设计规范)
- [ ] 创建基础组件库
- [ ] Web3 钱包集成

### 阶段 2: 首页 (Week 2)
- [ ] 实现首页 UI (严格按照 home.png)
- [ ] Header 和 Footer
- [ ] 统计数据动态展示

### 阶段 3: 每日打卡核心 (Week 3-4)
- [ ] 质押页面
- [ ] 打卡日历
- [ ] 打卡任务提交
- [ ] 红包系统

### 阶段 4: 景点打卡 (Week 5)
- [ ] 任务列表
- [ ] 任务详情
- [ ] 打卡流程

### 阶段 5: 奖励和成就 (Week 6)
- [ ] 幸运转盘
- [ ] 成就系统
- [ ] 个人中心

### 阶段 6: 智能合约 (Week 7-8)
- [ ] 编写合约
- [ ] 测试部署
- [ ] 前端集成

### 阶段 7: 优化和测试 (Week 9)
- [ ] 性能优化
- [ ] 移动端适配
- [ ] 测试和修复

---

## ⚠️ 技术挑战

1. **链上随机数**
   - 使用 Chainlink VRF
   - 或 commit-reveal 机制

2. **内容审核**
   - 前端字数检测
   - 后端 AI 审核（图片、文本）

3. **利息计算**
   - 智能合约精确计算
   - 考虑 gas 优化

4. **数据存储**
   - 打卡记录上链（核心数据）
   - 内容存储（IPFS/Arweave）

---

## 💰 成本估算

### 开发成本
- 前端开发: 8-9 周
- 智能合约: 2 周
- 测试部署: 1 周

### 运营成本
- Gas 费用优化
- IPFS 存储费用
- 审核人工成本

---

## 📝 下一步行动

**请审查此计划并确认：**

1. ✅ **同意**：我立即开始从阶段1执行
2. 🔄 **修改**：指出需要调整的部分
3. 📋 **分步执行**：指定从哪个阶段开始

等待您的审查意见...
