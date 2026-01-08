'use client';

import { useState } from 'react';
import Link from 'next/link';
import MilestoneSelector from '@/components/checkin/milestone-selector';
import LockModeToggle from '@/components/checkin/lock-mode-toggle';
import RewardsCalculator from '@/components/checkin/rewards-calculator';

export default function StakePage() {
  const [amount, setAmount] = useState<number>(100);
  const [milestoneDays, setMilestoneDays] = useState<number>(30);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    // 限制在 1-1000 范围内
    if (value >= 0 && value <= 1000) {
      setAmount(value);
    }
  };

  const handleStake = () => {
    // TODO: 调用智能合约
    console.log('Stake:', { amount, milestoneDays, isLocked });
    alert('质押功能即将上线！');
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
          <h1 className="text-2xl font-bold">每日打卡 - 质押</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - 质押设置 */}
          <div className="space-y-6">
            {/* 质押金额输入 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <label className="text-sm font-medium text-gray-300">质押金额</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-3xl font-bold text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="100"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  代币
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>最低: 1 代币</span>
                <span>最高: 1000 代币</span>
              </div>

              {/* 快捷金额按钮 */}
              <div className="grid grid-cols-4 gap-2">
                {[100, 200, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="glass-panel py-2 rounded-lg hover:border-primary transition-all text-sm font-medium"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 锁定方式选择 */}
            <div className="glass-panel p-6 rounded-xl">
              <LockModeToggle isLocked={isLocked} onChange={setIsLocked} />
            </div>

            {/* 里程碑选择 */}
            <div className="glass-panel p-6 rounded-xl">
              <MilestoneSelector
                selected={milestoneDays}
                onSelect={setMilestoneDays}
                isLocked={isLocked}
              />
            </div>
          </div>

          {/* Right Column - 收益预估 */}
          <div className="space-y-6">
            <RewardsCalculator
              amount={amount}
              milestoneDays={milestoneDays}
              isLocked={isLocked}
            />

            {/* 确认质押按钮 */}
            <button
              onClick={handleStake}
              disabled={amount < 1 || amount > 1000}
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-8 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:scale-105 animate-glow shadow-[0_0_20px_rgba(37,244,120,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="material-symbols-outlined">lock</span>
              <span>确认质押</span>
            </button>

            {/* 说明文字 */}
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">info</span>
                重要提示
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>质押后需每日完成打卡任务才能获得红包奖励</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>封存模式必须完成里程碑才能取回，利息更高</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>随时可取模式可随时取回本金，但利息减半</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>断卡后可使用补卡次数（最多3次）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>完成里程碑可获得专属徽章和抽奖机会</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
