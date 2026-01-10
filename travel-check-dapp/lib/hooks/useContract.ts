import { useState, useEffect } from 'react';
import { mockDailyCheckIn, mockSpotCheckIn, mockLottery, initMockData } from '@/lib/mock/contracts';
import type { StakeInfo, CheckInRecord, UserSpotTask } from '@/lib/mock/contracts';

// 初始化Mock数据
if (typeof window !== 'undefined') {
  initMockData();
}

// ===== useDailyCheckIn Hook =====

export function useDailyCheckIn() {
  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stake = mockDailyCheckIn.getStakeInfo();
    const records = mockDailyCheckIn.getCheckInRecords();
    setStakeInfo(stake);
    setCheckInRecords(records);
  };

  const stake = async (amount: number, milestoneDays: number, isLocked: boolean) => {
    setLoading(true);
    try {
      await mockDailyCheckIn.stake(amount, milestoneDays, isLocked);
      loadData();
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async (content: string): Promise<number> => {
    setLoading(true);
    try {
      const redPacket = await mockDailyCheckIn.checkIn(content);
      loadData();
      return redPacket;
    } finally {
      setLoading(false);
    }
  };

  const makeUp = async (taskType: number, content: string) => {
    setLoading(true);
    try {
      await mockDailyCheckIn.makeUp(taskType, content);
      loadData();
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (): Promise<number> => {
    setLoading(true);
    try {
      const totalAmount = await mockDailyCheckIn.withdraw();
      loadData();
      return totalAmount;
    } finally {
      setLoading(false);
    }
  };

  return {
    stakeInfo,
    checkInRecords,
    loading,
    stake,
    checkIn,
    makeUp,
    withdraw,
  };
}

// ===== useSpotCheckIn Hook =====

export function useSpotCheckIn() {
  const [userTasks, setUserTasks] = useState<Record<string, UserSpotTask>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const tasks = mockSpotCheckIn.getUserTasks();
    setUserTasks(tasks);
  };

  const joinTask = async (taskId: string, amount: number) => {
    setLoading(true);
    try {
      await mockSpotCheckIn.joinTask(taskId, amount);
      loadData();
    } finally {
      setLoading(false);
    }
  };

  const submitCheckIn = async (taskId: string, photos: string[], verificationCode: string) => {
    setLoading(true);
    try {
      await mockSpotCheckIn.submitCheckIn(taskId, photos, verificationCode);
      loadData();
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (taskId: string): Promise<number> => {
    setLoading(true);
    try {
      const totalAmount = await mockSpotCheckIn.claimReward(taskId);
      loadData();
      return totalAmount;
    } finally {
      setLoading(false);
    }
  };

  const getUserTask = (taskId: string): UserSpotTask | null => {
    return mockSpotCheckIn.getUserTask(taskId);
  };

  return {
    userTasks,
    loading,
    joinTask,
    submitCheckIn,
    claimReward,
    getUserTask,
  };
}

// ===== useLottery Hook =====

export function useLottery() {
  const [spinsAvailable, setSpinsAvailable] = useState(0);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const spins = mockLottery.getSpinsAvailable();
    const history = mockLottery.getSpinHistory();
    setSpinsAvailable(spins);
    setSpinHistory(history);
  };

  const spin = async (): Promise<{ prizeIndex: number; prizeName: string; prizeValue: number; prizeType: string }> => {
    setLoading(true);
    try {
      const result = await mockLottery.spin();
      loadData();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const awardSpins = (amount: number) => {
    mockLottery.awardSpins(amount);
    loadData();
  };

  return {
    spinsAvailable,
    spinHistory,
    loading,
    spin,
    awardSpins,
  };
}
