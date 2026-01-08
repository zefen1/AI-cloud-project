'use client';

import { useState } from 'react';
import Link from 'next/link';
import AchievementBadge, { Achievement } from '@/components/rewards/achievement-badge';

export default function ProfilePage() {
  // TODO: 从智能合约获取数据
  const [userStats] = useState({
    address: '0x1234...5678',
    totalStaked: 1500,
    totalEarnings: 356.8,
    pendingRewards: 45.2,
    dailyStreak: 23,
    totalCheckIns: 45,
    milestonesCompleted: 1,
    spotsVisited: 2,
    achievementsUnlocked: 3,
    lotterySpins: 15,
  });

  const [recentAchievements] = useState<Achievement[]>([
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
  ]);

  const [transactions] = useState([
    { id: '1', type: 'stake', amount: 500, date: '2026-01-08', description: '每日打卡质押' },
    { id: '2', type: 'reward', amount: 25.5, date: '2026-01-08', description: '打卡奖励' },
    { id: '3', type: 'interest', amount: 15.2, date: '2026-01-07', description: '利息收益' },
    { id: '4', type: 'lottery', amount: 50, date: '2026-01-07', description: '抽奖奖励' },
    { id: '5', type: 'stake', amount: 300, date: '2026-01-06', description: '景点打卡质押' },
  ]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'stake':
        return { icon: 'lock', color: 'text-blue-500' };
      case 'reward':
        return { icon: 'redeem', color: 'text-primary' };
      case 'interest':
        return { icon: 'trending_up', color: 'text-green-500' };
      case 'lottery':
        return { icon: 'casino', color: 'text-yellow-500' };
      default:
        return { icon: 'attach_money', color: 'text-gray-500' };
    }
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
          <h1 className="text-2xl font-bold">个人中心</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 用户信息 */}
          <div className="space-y-6">
            {/* 用户卡片 */}
            <div className="glass-panel p-6 rounded-xl text-center space-y-4">
              {/* 头像 */}
              <div className="size-24 rounded-full bg-gradient-to-br from-primary to-primary-hover mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-background-dark">
                  person
                </span>
              </div>

              {/* 地址 */}
              <div>
                <p className="text-sm text-gray-400 mb-1">钱包地址</p>
                <p className="text-lg font-mono font-bold">{userStats.address}</p>
              </div>

              {/* 快捷操作 */}
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Link
                  href="/daily-checkin/calendar"
                  className="glass-panel p-3 rounded-lg hover:border-primary transition-all text-center"
                >
                  <span className="material-symbols-outlined text-primary mb-1">
                    calendar_today
                  </span>
                  <p className="text-xs font-medium">每日打卡</p>
                </Link>
                <Link
                  href="/spot-checkin"
                  className="glass-panel p-3 rounded-lg hover:border-primary transition-all text-center"
                >
                  <span className="material-symbols-outlined text-primary mb-1">
                    location_on
                  </span>
                  <p className="text-xs font-medium">景点打卡</p>
                </Link>
                <Link
                  href="/rewards/lottery"
                  className="glass-panel p-3 rounded-lg hover:border-primary transition-all text-center"
                >
                  <span className="material-symbols-outlined text-primary mb-1">
                    casino
                  </span>
                  <p className="text-xs font-medium">幸运转盘</p>
                </Link>
                <Link
                  href="/rewards/achievements"
                  className="glass-panel p-3 rounded-lg hover:border-primary transition-all text-center"
                >
                  <span className="material-symbols-outlined text-primary mb-1">
                    emoji_events
                  </span>
                  <p className="text-xs font-medium">成就墙</p>
                </Link>
              </div>
            </div>

            {/* 最近成就 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">最近获得</h3>
                <Link
                  href="/rewards/achievements"
                  className="text-sm text-primary hover:underline"
                >
                  查看全部
                </Link>
              </div>

              <div className="flex gap-4 justify-center">
                {recentAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="small"
                    showProgress={false}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 数据统计 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 资产概览 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  account_balance_wallet
                </span>
                资产概览
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">质押总额</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.totalStaked}
                    <span className="text-sm ml-2 text-gray-400">代币</span>
                  </p>
                </div>
                <div className="glass-panel p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">累计收益</p>
                  <p className="text-2xl font-bold text-primary">
                    {userStats.totalEarnings}
                    <span className="text-sm ml-2 text-gray-400">代币</span>
                  </p>
                </div>
                <div className="glass-panel p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">待领取奖励</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {userStats.pendingRewards}
                    <span className="text-sm ml-2 text-gray-400">代币</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 打卡统计 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  bar_chart
                </span>
                打卡统计
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">
                    {userStats.dailyStreak}
                  </p>
                  <p className="text-sm text-gray-400">连续打卡天数</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {userStats.totalCheckIns}
                  </p>
                  <p className="text-sm text-gray-400">累计打卡次数</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {userStats.milestonesCompleted}
                  </p>
                  <p className="text-sm text-gray-400">完成的里程碑</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {userStats.spotsVisited}
                  </p>
                  <p className="text-sm text-gray-400">打卡景点数</p>
                </div>
              </div>

              {/* 进度条 */}
              <div className="pt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">100天里程碑进度</span>
                    <span className="text-sm font-bold text-primary">45%</span>
                  </div>
                  <div className="relative h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-hover"
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">成就完成度</span>
                    <span className="text-sm font-bold text-primary">25%</span>
                  </div>
                  <div className="relative h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{ width: '25%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 交易历史 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  receipt_long
                </span>
                交易历史
              </h2>

              <div className="space-y-2">
                {transactions.map((tx) => {
                  const { icon, color } = getTransactionIcon(tx.type);
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 glass-panel rounded-lg hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                          <span className={`material-symbols-outlined text-base ${color}`}>
                            {icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{tx.description}</p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            tx.type === 'stake' ? 'text-white' : 'text-primary'
                          }`}
                        >
                          {tx.type === 'stake' ? '-' : '+'}
                          {tx.amount}
                        </p>
                        <p className="text-xs text-gray-500">代币</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="w-full py-3 glass-panel rounded-lg hover:border-primary transition-all text-sm font-medium">
                查看更多交易
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
