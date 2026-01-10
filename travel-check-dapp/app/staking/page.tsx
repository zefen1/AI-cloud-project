'use client';

import Link from 'next/link';
import Header from '@/components/layout/header';
import StatsFooter from '@/components/layout/stats-footer';

export default function StakingPage() {
  return (
    <div className="min-h-screen bg-background-dark">
      <Header />

      <main className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              质押中心
            </h1>
            <p className="text-gray-400 text-lg">
              选择质押计划，获得打卡奖励和收益
            </p>
          </div>

          {/* Staking Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 每日打卡质押 */}
            <Link href="/daily-checkin/stake">
              <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-background-dark">
                        calendar_today
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">每日打卡质押</h3>
                      <p className="text-gray-400">Daily Check-in Staking</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>连续打卡赚取利息</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>灵活质押 2.5% 年化收益</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>锁定质押 5% 年化收益</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>每日红包奖励 5-50 USDT</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">可选周期</div>
                      <div className="text-white font-bold">30 / 100 / 200 / 365 天</div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <span>开始质押</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* 景点打卡质押 */}
            <Link href="/spot-checkin">
              <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-background-dark">
                        location_on
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">景点打卡质押</h3>
                      <p className="text-gray-400">Spot Check-in Staking</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>参与景点打卡任务</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>质押参与，完成获得奖励</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>未完成扣除质押金</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span>奖励池平均分配</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">任务类型</div>
                      <div className="text-white font-bold">单次 / 多次 / 系列</div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <span>浏览任务</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                </div>
                <div className="text-sm text-gray-400">总质押量</div>
              </div>
              <div className="text-3xl font-bold mb-1">12,456,789</div>
              <div className="text-sm text-gray-400">USDT</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">groups</span>
                </div>
                <div className="text-sm text-gray-400">参与用户</div>
              </div>
              <div className="text-3xl font-bold mb-1">8,432</div>
              <div className="text-sm text-gray-400">Active Stakers</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                </div>
                <div className="text-sm text-gray-400">累计收益</div>
              </div>
              <div className="text-3xl font-bold mb-1">456,123</div>
              <div className="text-sm text-gray-400">USDT Distributed</div>
            </div>
          </div>
        </div>
      </main>

      <StatsFooter />
    </div>
  );
}
