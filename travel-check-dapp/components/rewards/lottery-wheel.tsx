'use client';

import { useState } from 'react';

export interface Prize {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'token' | 'makeup' | 'badge' | 'nothing';
  value?: number;
}

const PRIZES: Prize[] = [
  { id: 0, name: '50代币', icon: '💰', color: '#25f478', type: 'token', value: 50 },
  { id: 1, name: '补卡次数', icon: '🔄', color: '#3b82f6', type: 'makeup', value: 1 },
  { id: 2, name: '10代币', icon: '💵', color: '#10b981', type: 'token', value: 10 },
  { id: 3, name: '谢谢参与', icon: '😊', color: '#6b7280', type: 'nothing' },
  { id: 4, name: '100代币', icon: '💎', color: '#8b5cf6', type: 'token', value: 100 },
  { id: 5, name: '徽章', icon: '🏆', color: '#f59e0b', type: 'badge' },
  { id: 6, name: '20代币', icon: '💸', color: '#14b8a6', type: 'token', value: 20 },
  { id: 7, name: '补卡次数', icon: '🔄', color: '#3b82f6', type: 'makeup', value: 1 },
];

interface LotteryWheelProps {
  onSpinComplete?: (prize: Prize) => void;
}

export default function LotteryWheel({ onSpinComplete }: LotteryWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Prize | null>(null);

  const handleSpin = async () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    // 模拟抽奖结果（TODO: 从智能合约获取随机数）
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];

    // 计算旋转角度
    const baseRotation = 360 * 5; // 基础旋转5圈
    const prizeAngle = (360 / PRIZES.length) * prizeIndex;
    const finalRotation = baseRotation + (360 - prizeAngle) + (360 / PRIZES.length / 2);

    setRotation(rotation + finalRotation);

    // 等待动画完成
    setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      onSpinComplete?.(prize);
    }, 4000);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* 转盘容器 */}
      <div className="relative size-[400px]">
        {/* 指针 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="size-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
        </div>

        {/* 转盘 */}
        <div
          className="size-full rounded-full relative overflow-hidden shadow-[0_0_40px_rgba(37,244,120,0.3)] border-8 border-primary/30"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
          }}
        >
          {PRIZES.map((prize, index) => {
            const angle = (360 / PRIZES.length) * index;
            const nextAngle = (360 / PRIZES.length) * (index + 1);

            return (
              <div
                key={prize.id}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${
                    50 + 50 * Math.sin((nextAngle * Math.PI) / 180)
                  }% ${50 - 50 * Math.cos((nextAngle * Math.PI) / 180)}%)`,
                }}
              >
                <div
                  className="w-full h-full flex items-start justify-center pt-12"
                  style={{
                    background: `linear-gradient(180deg, ${prize.color} 0%, ${prize.color}dd 100%)`,
                  }}
                >
                  <div
                    className="flex flex-col items-center gap-2"
                    style={{
                      transform: `rotate(${(360 / PRIZES.length) / 2}deg)`,
                    }}
                  >
                    <span className="text-4xl">{prize.icon}</span>
                    <span className="text-xs font-bold text-white text-shadow-lg">
                      {prize.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 中心圆 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-full bg-gradient-to-br from-primary to-primary-hover border-4 border-white shadow-lg" />
        </div>

        {/* 中心按钮 */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full bg-gradient-to-br from-primary to-primary-hover text-background-dark font-bold text-sm shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 flex items-center justify-center"
        >
          {spinning ? (
            <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            '抽奖'
          )}
        </button>
      </div>

      {/* 结果显示 */}
      {result && !spinning && (
        <div className="mt-8 glass-panel p-6 rounded-xl text-center animate-in fade-in zoom-in duration-300">
          <p className="text-sm text-gray-400 mb-2">恭喜获得</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl">{result.icon}</span>
            <div className="text-left">
              <p className="text-2xl font-bold text-white">{result.name}</p>
              {result.value && (
                <p className="text-sm text-gray-400">
                  {result.type === 'token' && '已发放到账户'}
                  {result.type === 'makeup' && '已添加到补卡次数'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 说明 */}
      <div className="mt-6 max-w-md">
        <div className="glass-panel p-4 rounded-xl">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">info</span>
            抽奖规则
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>每完成一次打卡获得1次抽奖机会</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>奖品随机生成，公平公正</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>抽中的代币立即发放到账户</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>抽奖机会不会过期</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
