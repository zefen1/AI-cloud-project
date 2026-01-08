'use client';

import { MILESTONES } from './milestone-selector';

interface RewardsCalculatorProps {
  amount: number;
  milestoneDays: number;
  isLocked: boolean;
}

export default function RewardsCalculator({ amount, milestoneDays, isLocked }: RewardsCalculatorProps) {
  const milestone = MILESTONES.find((m) => m.days === milestoneDays);
  if (!milestone || amount <= 0) {
    return null;
  }

  const interestRate = isLocked ? milestone.lockedInterest : milestone.flexibleInterest;
  const interest = (amount * interestRate) / 100;
  const totalReturn = amount + interest;

  // 红包范围计算
  const redPacketMin = isLocked ? amount * 0.001 : amount * 0.0003;
  const redPacketMax = isLocked ? amount * 0.003 : amount * 0.0006;
  const totalRedPacket = ((redPacketMin + redPacketMax) / 2) * milestoneDays;

  return (
    <div className="glass-panel p-6 rounded-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">calculate</span>
        收益预估
      </h3>

      <div className="space-y-3">
        {/* 本金 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">质押本金</span>
          <span className="text-white font-bold">{amount.toLocaleString()} 代币</span>
        </div>

        {/* 利息 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">
            利息 ({interestRate}%)
          </span>
          <span className="text-primary font-bold">+{interest.toFixed(2)} 代币</span>
        </div>

        {/* 红包总额 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">
            红包总额 ({milestoneDays}天)
          </span>
          <span className="text-primary font-bold">~{totalRedPacket.toFixed(2)} 代币</span>
        </div>

        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">预期总收益</span>
            <div className="text-right">
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
                {totalReturn.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                + ~{totalRedPacket.toFixed(2)} 红包
              </div>
            </div>
          </div>
        </div>

        {/* 额外奖励 */}
        <div className="glass-panel bg-primary/5 border border-primary/20 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-2xl">{milestone.badge}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-white mb-1">
                完成奖励: {milestone.title}
              </div>
              <div className="text-xs text-gray-400">
                ✨ 获得专属徽章
              </div>
              <div className="text-xs text-gray-400">
                🎁 额外奖励代币
              </div>
              <div className="text-xs text-gray-400">
                🎰 抽奖机会
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="text-xs text-gray-500 pt-3 border-t border-white/10">
        * 以上为预估收益，实际收益以链上数据为准
        <br />
        * 每日红包金额随机，范围为 {redPacketMin.toFixed(4)} ~ {redPacketMax.toFixed(4)} 代币
      </div>
    </div>
  );
}
