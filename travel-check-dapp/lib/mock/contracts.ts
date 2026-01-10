// Mock 智能合约数据服务
// 用于前端开发和测试，模拟合约调用

export interface StakeInfo {
  amount: number;
  milestoneDays: number;
  isLocked: boolean;
  startTime: number;
  currentDay: number;
  lastCheckInTime: number;
  earnedInterest: number;
  redPackets: number;
  missedDays: number;
  remainingMakeups: number;
  completed: boolean;
}

export interface CheckInRecord {
  timestamp: number;
  content: string;
  dataHash: string; // IPFS hash of the check-in data (text + image)
  redPacket: number;
}

export interface SpotTaskData {
  id: string;
  name: string;
  location: string;
  description: string;
  minStake: number;
  maxStake: number;
  dailyInterest: number;
  totalReward: number;
  deadline: string;
  active: boolean;
  participants: number;
}

export interface UserSpotTask {
  taskId: string;
  stakeAmount: number;
  startTime: number;
  earnedInterest: number;
  photos: string[];
  verificationCode: string;
  submitted: boolean;
  approved: boolean;
  claimed: boolean;
}

// 模拟本地存储
const STORAGE_KEYS = {
  DAILY_STAKE: 'mock_daily_stake',
  CHECKIN_RECORDS: 'mock_checkin_records',
  SPOT_TASKS: 'mock_spot_tasks',
  USER_SPOT_TASKS: 'mock_user_spot_tasks',
  LOTTERY_SPINS: 'mock_lottery_spins',
  LOTTERY_HISTORY: 'mock_lottery_history',
};

// ===== DailyCheckIn Mock =====

export const mockDailyCheckIn = {
  async stake(amount: number, milestoneDays: number, isLocked: boolean): Promise<void> {
    const stakeInfo: StakeInfo = {
      amount,
      milestoneDays,
      isLocked,
      startTime: Date.now(),
      currentDay: 0,
      lastCheckInTime: 0,
      earnedInterest: 0,
      redPackets: 0,
      missedDays: 0,
      remainingMakeups: 3,
      completed: false,
    };
    localStorage.setItem(STORAGE_KEYS.DAILY_STAKE, JSON.stringify(stakeInfo));
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟交易延迟
  },

  async checkIn(content: string, dataHash: string): Promise<number> {
    const stakeInfo = this.getStakeInfo();
    if (!stakeInfo) throw new Error('No active stake');

    // 生成随机红包
    const redPacket = Math.floor(Math.random() * 46) + 5;

    // 计算利息
    const rate = stakeInfo.isLocked ? 0.05 : 0.025;
    const dailyInterest = (stakeInfo.amount * rate) / 365;

    stakeInfo.currentDay += 1;
    stakeInfo.lastCheckInTime = Date.now();
    stakeInfo.earnedInterest += dailyInterest;
    stakeInfo.redPackets += redPacket;

    if (stakeInfo.currentDay >= stakeInfo.milestoneDays) {
      stakeInfo.completed = true;
    }

    localStorage.setItem(STORAGE_KEYS.DAILY_STAKE, JSON.stringify(stakeInfo));

    // 保存打卡记录
    const records = this.getCheckInRecords();
    records.push({
      timestamp: Date.now(),
      content,
      dataHash, // IPFS hash
      redPacket,
    });
    localStorage.setItem(STORAGE_KEYS.CHECKIN_RECORDS, JSON.stringify(records));

    await new Promise(resolve => setTimeout(resolve, 1000));
    return redPacket;
  },

  async makeUp(taskType: number, content: string): Promise<void> {
    const stakeInfo = this.getStakeInfo();
    if (!stakeInfo) throw new Error('No active stake');

    stakeInfo.remainingMakeups -= 1;
    stakeInfo.missedDays += 1;
    stakeInfo.currentDay += 1;
    stakeInfo.lastCheckInTime = Date.now();

    localStorage.setItem(STORAGE_KEYS.DAILY_STAKE, JSON.stringify(stakeInfo));
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  async withdraw(): Promise<number> {
    const stakeInfo = this.getStakeInfo();
    if (!stakeInfo) throw new Error('No active stake');

    const totalAmount = stakeInfo.amount + stakeInfo.earnedInterest + stakeInfo.redPackets;

    localStorage.removeItem(STORAGE_KEYS.DAILY_STAKE);
    localStorage.removeItem(STORAGE_KEYS.CHECKIN_RECORDS);

    await new Promise(resolve => setTimeout(resolve, 1000));
    return totalAmount;
  },

  getStakeInfo(): StakeInfo | null {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_STAKE);
    return data ? JSON.parse(data) : null;
  },

  getCheckInRecords(): CheckInRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHECKIN_RECORDS);
    return data ? JSON.parse(data) : [];
  },
};

// ===== SpotCheckIn Mock =====

export const mockSpotCheckIn = {
  async joinTask(taskId: string, amount: number): Promise<void> {
    const userTask: UserSpotTask = {
      taskId,
      stakeAmount: amount,
      startTime: Date.now(),
      earnedInterest: 0,
      photos: [],
      verificationCode: '',
      submitted: false,
      approved: false,
      claimed: false,
    };

    const tasks = this.getUserTasks();
    tasks[taskId] = userTask;
    localStorage.setItem(STORAGE_KEYS.USER_SPOT_TASKS, JSON.stringify(tasks));

    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  async submitCheckIn(taskId: string, photos: string[], verificationCode: string): Promise<void> {
    const tasks = this.getUserTasks();
    const task = tasks[taskId];
    if (!task) throw new Error('Task not found');

    task.photos = photos;
    task.verificationCode = verificationCode;
    task.submitted = true;

    // 模拟自动审核通过
    setTimeout(() => {
      task.approved = true;
      localStorage.setItem(STORAGE_KEYS.USER_SPOT_TASKS, JSON.stringify(tasks));
    }, 3000);

    localStorage.setItem(STORAGE_KEYS.USER_SPOT_TASKS, JSON.stringify(tasks));
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  async claimReward(taskId: string): Promise<number> {
    const tasks = this.getUserTasks();
    const task = tasks[taskId];
    if (!task) throw new Error('Task not found');
    if (!task.approved) throw new Error('Not approved yet');

    task.claimed = true;

    // 计算收益
    const daysStaked = Math.floor((Date.now() - task.startTime) / (1000 * 60 * 60 * 24));
    const dailyInterest = 5; // 5%
    task.earnedInterest = (task.stakeAmount * dailyInterest * daysStaked) / 100;

    const totalAmount = task.stakeAmount + task.earnedInterest + 1500; // totalReward

    localStorage.setItem(STORAGE_KEYS.USER_SPOT_TASKS, JSON.stringify(tasks));
    await new Promise(resolve => setTimeout(resolve, 1000));

    return totalAmount;
  },

  getUserTasks(): Record<string, UserSpotTask> {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SPOT_TASKS);
    return data ? JSON.parse(data) : {};
  },

  getUserTask(taskId: string): UserSpotTask | null {
    const tasks = this.getUserTasks();
    return tasks[taskId] || null;
  },
};

// ===== Lottery Mock =====

export const mockLottery = {
  async spin(): Promise<{ prizeIndex: number; prizeName: string; prizeValue: number; prizeType: string }> {
    const spins = this.getSpinsAvailable();
    if (spins <= 0) throw new Error('No spins available');

    // 扣除次数
    localStorage.setItem(STORAGE_KEYS.LOTTERY_SPINS, String(spins - 1));

    // 随机奖品
    const prizeIndex = Math.floor(Math.random() * 8);
    const prizes = [
      { name: '50代币', value: 50, type: 'token' },
      { name: '补卡次数', value: 1, type: 'makeup' },
      { name: '10代币', value: 10, type: 'token' },
      { name: '谢谢参与', value: 0, type: 'nothing' },
      { name: '100代币', value: 100, type: 'token' },
      { name: '徽章', value: 1, type: 'badge' },
      { name: '20代币', value: 20, type: 'token' },
      { name: '补卡次数', value: 1, type: 'makeup' },
    ];

    const prize = prizes[prizeIndex];

    // 保存历史
    const history = this.getSpinHistory();
    history.unshift({
      timestamp: Date.now(),
      ...prize,
    });
    localStorage.setItem(STORAGE_KEYS.LOTTERY_HISTORY, JSON.stringify(history.slice(0, 10)));

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      prizeIndex,
      prizeName: prize.name,
      prizeValue: prize.value,
      prizeType: prize.type,
    };
  },

  awardSpins(amount: number): void {
    const current = this.getSpinsAvailable();
    localStorage.setItem(STORAGE_KEYS.LOTTERY_SPINS, String(current + amount));
  },

  getSpinsAvailable(): number {
    const data = localStorage.getItem(STORAGE_KEYS.LOTTERY_SPINS);
    return data ? parseInt(data) : 3; // 默认3次
  },

  getSpinHistory(): any[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOTTERY_HISTORY);
    return data ? JSON.parse(data) : [];
  },
};

// 初始化模拟数据
export function initMockData() {
  if (typeof window === 'undefined') return;

  // 初始化抽奖次数
  if (!localStorage.getItem(STORAGE_KEYS.LOTTERY_SPINS)) {
    localStorage.setItem(STORAGE_KEYS.LOTTERY_SPINS, '3');
  }
}
