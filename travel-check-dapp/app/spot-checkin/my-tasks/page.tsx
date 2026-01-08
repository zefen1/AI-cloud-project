'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MyTask {
  id: string;
  name: string;
  location: string;
  stakeAmount: number;
  dailyInterest: number;
  startDate: string;
  deadline: string;
  status: 'ongoing' | 'completed' | 'failed';
  earnedInterest: number;
  totalEarnings: number;
  checkInStatus: 'pending' | 'submitted' | 'approved' | 'rejected';
}

// 模拟数据
const MOCK_MY_TASKS: MyTask[] = [
  {
    id: '2',
    name: '西湖美景打卡',
    location: '浙江 · 杭州',
    stakeAmount: 200,
    dailyInterest: 3,
    startDate: '2026-01-01',
    deadline: '2026-01-25',
    status: 'ongoing',
    earnedInterest: 14.4,
    totalEarnings: 0,
    checkInStatus: 'pending',
  },
  {
    id: '4',
    name: '黄山云海打卡',
    location: '安徽 · 黄山',
    stakeAmount: 300,
    dailyInterest: 4,
    startDate: '2025-12-20',
    deadline: '2026-02-10',
    status: 'completed',
    earnedInterest: 72,
    totalEarnings: 1572,
    checkInStatus: 'approved',
  },
  {
    id: '6',
    name: '外滩夜景打卡',
    location: '上海 · 黄浦',
    stakeAmount: 100,
    dailyInterest: 2,
    startDate: '2025-12-01',
    deadline: '2026-01-15',
    status: 'failed',
    earnedInterest: 0,
    totalEarnings: 0,
    checkInStatus: 'rejected',
  },
];

type TabType = 'all' | 'ongoing' | 'completed' | 'failed';

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredTasks = MOCK_MY_TASKS.filter((task) => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  const stats = {
    total: MOCK_MY_TASKS.length,
    ongoing: MOCK_MY_TASKS.filter((t) => t.status === 'ongoing').length,
    completed: MOCK_MY_TASKS.filter((t) => t.status === 'completed').length,
    failed: MOCK_MY_TASKS.filter((t) => t.status === 'failed').length,
    totalStaked: MOCK_MY_TASKS.reduce((sum, t) => sum + t.stakeAmount, 0),
    totalEarnings: MOCK_MY_TASKS.reduce((sum, t) => sum + t.totalEarnings, 0),
  };

  const getStatusColor = (status: MyTask['status']) => {
    switch (status) {
      case 'ongoing':
        return 'bg-primary/20 text-primary border-primary';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500';
      case 'failed':
        return 'bg-red-500/20 text-red-500 border-red-500';
    }
  };

  const getStatusLabel = (status: MyTask['status']) => {
    switch (status) {
      case 'ongoing':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '已失败';
    }
  };

  const getCheckInStatusColor = (status: MyTask['checkInStatus']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-400';
      case 'submitted':
        return 'text-yellow-500';
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
    }
  };

  const getCheckInStatusLabel = (status: MyTask['checkInStatus']) => {
    switch (status) {
      case 'pending':
        return '待打卡';
      case 'submitted':
        return '审核中';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
    }
  };

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="w-full px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <Link
            href="/spot-checkin"
            className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">我的景点任务</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">参与任务</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">进行中</p>
              <p className="text-2xl font-bold text-primary">{stats.ongoing}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">累计质押</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalStaked}
                <span className="text-sm ml-1 text-gray-400">代币</span>
              </p>
            </div>
            <div className="glass-panel p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">累计收益</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalEarnings}
                <span className="text-sm ml-1 text-gray-400">代币</span>
              </p>
            </div>
          </div>

          {/* 标签页 */}
          <div className="glass-panel p-1 rounded-xl inline-flex gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'all'
                  ? 'bg-primary text-background-dark'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              全部 ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'ongoing'
                  ? 'bg-primary text-background-dark'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              进行中 ({stats.ongoing})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'completed'
                  ? 'bg-primary text-background-dark'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              已完成 ({stats.completed})
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'failed'
                  ? 'bg-primary text-background-dark'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              已失败 ({stats.failed})
            </button>
          </div>

          {/* 任务列表 */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Link key={task.id} href={`/spot-checkin/${task.id}`}>
                <div className="glass-panel p-6 rounded-xl hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{task.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span className="material-symbols-outlined text-base">
                          location_on
                        </span>
                        <span>{task.location}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">打卡状态</p>
                      <p
                        className={`text-sm font-bold ${getCheckInStatusColor(
                          task.checkInStatus
                        )}`}
                      >
                        {getCheckInStatusLabel(task.checkInStatus)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="glass-panel p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">质押金额</p>
                      <p className="text-sm font-bold text-white">
                        {task.stakeAmount}
                        <span className="text-xs ml-1 text-gray-400">代币</span>
                      </p>
                    </div>
                    <div className="glass-panel p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">每日利息</p>
                      <p className="text-sm font-bold text-primary">
                        {task.dailyInterest}%
                      </p>
                    </div>
                    <div className="glass-panel p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">已赚利息</p>
                      <p className="text-sm font-bold text-primary">
                        {task.earnedInterest.toFixed(2)}
                        <span className="text-xs ml-1 text-gray-400">代币</span>
                      </p>
                    </div>
                    <div className="glass-panel p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">总收益</p>
                      <p className="text-sm font-bold text-primary">
                        {task.totalEarnings}
                        <span className="text-xs ml-1 text-gray-400">代币</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          event
                        </span>
                        <span>开始: {task.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          schedule
                        </span>
                        <span>截止: {task.deadline}</span>
                      </div>
                    </div>

                    {task.status === 'ongoing' && (
                      <span className="flex items-center gap-1 text-primary">
                        <span>查看详情</span>
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 空状态 */}
          {filteredTasks.length === 0 && (
            <div className="glass-panel p-12 rounded-xl text-center">
              <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
                inbox
              </span>
              <p className="text-gray-400 mb-4">暂无任务</p>
              <Link
                href="/spot-checkin"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background-dark px-6 py-3 rounded-full font-bold text-sm transition-all duration-300"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>参与新任务</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
