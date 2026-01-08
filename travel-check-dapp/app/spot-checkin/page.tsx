'use client';

import { useState } from 'react';
import Link from 'next/link';
import SpotTaskCard, { SpotTask } from '@/components/checkin/spot-task-card';

// 模拟数据
const MOCK_TASKS: SpotTask[] = [
  {
    id: '1',
    name: '长城打卡挑战',
    location: '北京 · 八达岭',
    image: '',
    deadline: '2026-02-01',
    minStake: 100,
    maxStake: 1000,
    dailyInterest: 5,
    totalReward: 1500,
    participants: 128,
    difficulty: 'medium',
    status: 'active',
  },
  {
    id: '2',
    name: '西湖美景打卡',
    location: '浙江 · 杭州',
    image: '',
    deadline: '2026-01-25',
    minStake: 50,
    maxStake: 500,
    dailyInterest: 3,
    totalReward: 800,
    participants: 256,
    difficulty: 'easy',
    status: 'active',
  },
  {
    id: '3',
    name: '珠峰大本营探险',
    location: '西藏 · 日喀则',
    image: '',
    deadline: '2026-03-15',
    minStake: 500,
    maxStake: 5000,
    dailyInterest: 10,
    totalReward: 8000,
    participants: 42,
    difficulty: 'hard',
    status: 'active',
  },
  {
    id: '4',
    name: '黄山云海打卡',
    location: '安徽 · 黄山',
    image: '',
    deadline: '2026-02-10',
    minStake: 80,
    maxStake: 800,
    dailyInterest: 4,
    totalReward: 1200,
    participants: 187,
    difficulty: 'medium',
    status: 'active',
  },
  {
    id: '5',
    name: '九寨沟风光记录',
    location: '四川 · 阿坝',
    image: '',
    deadline: '2026-01-20',
    minStake: 100,
    maxStake: 1000,
    dailyInterest: 6,
    totalReward: 2000,
    participants: 98,
    difficulty: 'medium',
    status: 'active',
  },
  {
    id: '6',
    name: '外滩夜景打卡',
    location: '上海 · 黄浦',
    image: '',
    deadline: '2026-01-15',
    minStake: 30,
    maxStake: 300,
    dailyInterest: 2,
    totalReward: 500,
    participants: 412,
    difficulty: 'easy',
    status: 'active',
  },
];

type SortOption = 'latest' | 'reward' | 'interest' | 'participants';
type FilterRegion = 'all' | 'north' | 'south' | 'east' | 'west';
type FilterDifficulty = 'all' | 'easy' | 'medium' | 'hard';

export default function SpotCheckInPage() {
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [filterRegion, setFilterRegion] = useState<FilterRegion>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all');

  // 筛选和排序逻辑
  const filteredAndSortedTasks = MOCK_TASKS.filter((task) => {
    if (filterDifficulty !== 'all' && task.difficulty !== filterDifficulty) {
      return false;
    }
    // TODO: 添加地区筛选逻辑
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'reward':
        return b.totalReward - a.totalReward;
      case 'interest':
        return b.dailyInterest - a.dailyInterest;
      case 'participants':
        return b.participants - a.participants;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="w-full px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold">景点打卡</h1>
          </div>

          <Link
            href="/spot-checkin/my-tasks"
            className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full hover:border-primary transition-all"
          >
            <span className="material-symbols-outlined text-base">assignment</span>
            <span className="text-sm font-medium">我的任务</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          {/* 说明卡片 */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">
                  location_on
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">景点打卡任务</h2>
                <p className="text-gray-400 text-sm mb-4">
                  选择感兴趣的景点任务，质押代币后前往景点打卡，完成任务即可获得奖励和每日利息。
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      check_circle
                    </span>
                    <span className="text-gray-400">质押即可参与</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      trending_up
                    </span>
                    <span className="text-gray-400">每日利息收益</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      redeem
                    </span>
                    <span className="text-gray-400">完成即得奖励</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 筛选和排序 */}
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* 筛选 */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">难度:</span>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value as FilterDifficulty)}
                    className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
                  >
                    <option value="all">全部</option>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">地区:</span>
                  <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value as FilterRegion)}
                    className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
                  >
                    <option value="all">全部</option>
                    <option value="north">华北</option>
                    <option value="south">华南</option>
                    <option value="east">华东</option>
                    <option value="west">西部</option>
                  </select>
                </div>
              </div>

              {/* 排序 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">排序:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
                >
                  <option value="latest">最新发布</option>
                  <option value="reward">奖励最高</option>
                  <option value="interest">利息最高</option>
                  <option value="participants">人气最高</option>
                </select>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                共 <span className="text-primary font-bold">{filteredAndSortedTasks.length}</span> 个任务
              </span>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-primary"></span>
                  <span>进行中</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-gray-500"></span>
                  <span>已完成</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-red-500"></span>
                  <span>已过期</span>
                </div>
              </div>
            </div>
          </div>

          {/* 任务列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTasks.map((task) => (
              <SpotTaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* 空状态 */}
          {filteredAndSortedTasks.length === 0 && (
            <div className="glass-panel p-12 rounded-xl text-center">
              <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
                search_off
              </span>
              <p className="text-gray-400">没有找到符合条件的任务</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
