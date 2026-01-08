'use client';

import { useState } from 'react';
import Link from 'next/link';
import LotteryWheel, { Prize } from '@/components/rewards/lottery-wheel';

export default function LotteryPage() {
  const [availableSpins, setAvailableSpins] = useState(3); // TODO: 从智能合约获取
  const [totalSpins, setTotalSpins] = useState(15);
  const [recentPrizes, setRecentPrizes] = useState<Prize[]>([]);

  const handleSpinComplete = (prize: Prize) => {
    setAvailableSpins(availableSpins - 1);
    setTotalSpins(totalSpins + 1);
    setRecentPrizes([prize, ...recentPrizes].slice(0, 5));
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
          <h1 className="text-2xl font-bold">幸运转盘</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 转盘 */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-8 rounded-xl">
              <LotteryWheel onSpinComplete={handleSpinComplete} />
            </div>
          </div>

          {/* Right Column - 信息 */}
          <div className="space-y-6">
            {/* 抽奖次数 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  confirmation_number
                </span>
                抽奖次数
              </h3>

              <div className="glass-panel p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-2">可用次数</p>
                <p className="text-4xl font-bold text-primary">
                  {availableSpins}
                  <span className="text-lg ml-2 text-gray-400">次</span>
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">累计抽奖</span>
                <span className="font-bold text-white">{totalSpins} 次</span>
              </div>

              {availableSpins === 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-500">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-base">info</span>
                    <div>
                      <p className="font-bold mb-1">次数不足</p>
                      <p className="text-xs text-yellow-500/80">
                        完成每日打卡任务即可获得抽奖机会
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 获取途径 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  redeem
                </span>
                获取途径
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 glass-panel rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      task_alt
                    </span>
                    <span className="text-sm text-gray-300">完成每日打卡</span>
                  </div>
                  <span className="text-sm font-bold text-primary">+1 次</span>
                </div>

                <div className="flex items-center justify-between p-3 glass-panel rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      location_on
                    </span>
                    <span className="text-sm text-gray-300">完成景点打卡</span>
                  </div>
                  <span className="text-sm font-bold text-primary">+2 次</span>
                </div>

                <div className="flex items-center justify-between p-3 glass-panel rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      military_tech
                    </span>
                    <span className="text-sm text-gray-300">达成里程碑</span>
                  </div>
                  <span className="text-sm font-bold text-primary">+5 次</span>
                </div>
              </div>

              <Link
                href="/daily-checkin/calendar"
                className="w-full flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 border border-primary text-primary px-4 py-3 rounded-lg font-bold text-sm transition-all"
              >
                <span className="material-symbols-outlined text-base">
                  add_circle
                </span>
                <span>去完成任务</span>
              </Link>
            </div>

            {/* 最近获得 */}
            {recentPrizes.length > 0 && (
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    history
                  </span>
                  最近获得
                </h3>

                <div className="space-y-2">
                  {recentPrizes.map((prize, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 glass-panel rounded-lg"
                    >
                      <span className="text-2xl">{prize.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{prize.name}</p>
                        <p className="text-xs text-gray-500">刚刚</p>
                      </div>
                      {prize.value && (
                        <span className="text-xs font-bold text-primary">
                          +{prize.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 奖品列表 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  card_giftcard
                </span>
                奖品列表
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>💎</span>
                    <span className="text-gray-300">100代币</span>
                  </div>
                  <span className="text-xs text-gray-500">稀有</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="text-gray-300">50代币</span>
                  </div>
                  <span className="text-xs text-gray-500">普通</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>💸</span>
                    <span className="text-gray-300">20代币</span>
                  </div>
                  <span className="text-xs text-gray-500">常见</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>💵</span>
                    <span className="text-gray-300">10代币</span>
                  </div>
                  <span className="text-xs text-gray-500">常见</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>🔄</span>
                    <span className="text-gray-300">补卡次数</span>
                  </div>
                  <span className="text-xs text-gray-500">普通</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>🏆</span>
                    <span className="text-gray-300">专属徽章</span>
                  </div>
                  <span className="text-xs text-gray-500">稀有</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
