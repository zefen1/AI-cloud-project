'use client';

import { useState } from 'react';
import Link from 'next/link';
import AchievementBadge, { Achievement } from '@/components/rewards/achievement-badge';

// 模拟成就数据
const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    name: '旅行新芽',
    description: '完成第一次每日打卡',
    icon: '🌱',
    requirement: '完成1次每日打卡',
    rarity: 'common',
    unlocked: true,
    unlockedAt: '2026-01-01',
  },
  {
    id: '2',
    name: '坚持七天',
    description: '连续打卡7天',
    icon: '📅',
    requirement: '连续打卡7天',
    rarity: 'common',
    unlocked: true,
    unlockedAt: '2026-01-07',
  },
  {
    id: '3',
    name: '旅行达人',
    description: '完成30天里程碑',
    icon: '⭐',
    requirement: '完成30天里程碑',
    rarity: 'rare',
    unlocked: true,
    unlockedAt: '2026-01-20',
  },
  {
    id: '4',
    name: '探险家',
    description: '完成100天里程碑',
    icon: '🌟',
    requirement: '完成100天里程碑',
    rarity: 'epic',
    unlocked: false,
    progress: 45,
    maxProgress: 100,
  },
  {
    id: '5',
    name: '旅行大师',
    description: '完成365天里程碑',
    icon: '👑',
    requirement: '完成365天里程碑',
    rarity: 'legendary',
    unlocked: false,
    progress: 15,
    maxProgress: 365,
  },
  {
    id: '6',
    name: '景点收集者',
    description: '打卡5个不同景点',
    icon: '📍',
    requirement: '打卡5个不同景点',
    rarity: 'rare',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
  },
  {
    id: '7',
    name: '环游世界',
    description: '打卡20个不同景点',
    icon: '🌍',
    requirement: '打卡20个不同景点',
    rarity: 'epic',
    unlocked: false,
    progress: 2,
    maxProgress: 20,
  },
  {
    id: '8',
    name: '财富积累',
    description: '累计收益达到1000代币',
    icon: '💰',
    requirement: '累计收益达到1000代币',
    rarity: 'rare',
    unlocked: false,
    progress: 356,
    maxProgress: 1000,
  },
  {
    id: '9',
    name: '幸运之星',
    description: '抽奖获得10次大奖',
    icon: '🎰',
    requirement: '抽奖获得10次大奖',
    rarity: 'epic',
    unlocked: false,
    progress: 3,
    maxProgress: 10,
  },
  {
    id: '10',
    name: '完美主义',
    description: '连续30天无断卡',
    icon: '💯',
    requirement: '连续30天无断卡',
    rarity: 'epic',
    unlocked: false,
    progress: 7,
    maxProgress: 30,
  },
  {
    id: '11',
    name: '社区之星',
    description: '邀请10位好友加入',
    icon: '🌟',
    requirement: '邀请10位好友加入',
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: '12',
    name: '传奇旅者',
    description: '获得所有其他徽章',
    icon: '🏆',
    requirement: '获得所有其他徽章',
    rarity: 'legendary',
    unlocked: false,
    progress: 3,
    maxProgress: 11,
  },
];

type FilterType = 'all' | 'unlocked' | 'locked';
type RarityFilter = 'all' | 'common' | 'rare' | 'epic' | 'legendary';

export default function AchievementsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    if (filter === 'unlocked' && !achievement.unlocked) return false;
    if (filter === 'locked' && achievement.unlocked) return false;
    if (rarityFilter !== 'all' && achievement.rarity !== rarityFilter) return false;
    return true;
  });

  const stats = {
    total: ACHIEVEMENTS.length,
    unlocked: ACHIEVEMENTS.filter((a) => a.unlocked).length,
    progress: Math.round(
      (ACHIEVEMENTS.filter((a) => a.unlocked).length / ACHIEVEMENTS.length) * 100
    ),
  };

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="w-full px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">成就墙</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {stats.unlocked} / {stats.total}
                </h2>
                <p className="text-sm text-gray-400">已解锁成就</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{stats.progress}%</p>
                <p className="text-sm text-gray-400">完成度</p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>

          {/* 筛选器 */}
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* 状态筛选 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === 'all'
                      ? 'bg-primary text-background-dark'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  全部 ({ACHIEVEMENTS.length})
                </button>
                <button
                  onClick={() => setFilter('unlocked')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === 'unlocked'
                      ? 'bg-primary text-background-dark'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  已解锁 ({stats.unlocked})
                </button>
                <button
                  onClick={() => setFilter('locked')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === 'locked'
                      ? 'bg-primary text-background-dark'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  未解锁 ({stats.total - stats.unlocked})
                </button>
              </div>

              {/* 稀有度筛选 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">稀有度:</span>
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}
                  className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
                >
                  <option value="all">全部</option>
                  <option value="common">普通</option>
                  <option value="rare">稀有</option>
                  <option value="epic">史诗</option>
                  <option value="legendary">传说</option>
                </select>
              </div>
            </div>
          </div>

          {/* 成就网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="glass-panel p-4 rounded-xl hover:border-primary transition-all cursor-pointer"
              >
                <AchievementBadge achievement={achievement} size="medium" />

                {/* 要求说明 */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center">
                    {achievement.requirement}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredAchievements.length === 0 && (
            <div className="glass-panel p-12 rounded-xl text-center">
              <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
                search_off
              </span>
              <p className="text-gray-400">没有找到符合条件的成就</p>
            </div>
          )}

          {/* 提示 */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                emoji_events
              </span>
              如何获得成就
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">每日打卡</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>坚持每天完成打卡任务</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>达成不同天数的里程碑</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>保持连续打卡记录</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">景点打卡</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>参与景点打卡任务</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>探索更多不同的景点</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>完成高难度任务</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">收益累积</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>通过打卡赚取代币</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>质押获得利息收益</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>参与幸运转盘抽奖</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">社区互动</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>邀请好友加入平台</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>分享旅行攻略</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>帮助新用户成长</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
