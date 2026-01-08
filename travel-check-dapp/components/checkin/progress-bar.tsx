'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const isComplete = current >= total;

  return (
    <div className="space-y-3">
      {/* 标题和数字 */}
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-sm font-medium text-gray-300">{label}</span>
        )}
        <span className="text-sm font-bold text-white">
          {current} / {total} 天
          <span className="ml-2 text-primary">({percentage}%)</span>
        </span>
      </div>

      {/* 进度条 */}
      <div className="relative h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            isComplete
              ? 'bg-gradient-to-r from-primary to-primary-hover animate-glow'
              : 'bg-gradient-to-r from-primary/60 to-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 里程碑标记 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>0</span>
        {total === 30 && <span className="text-gray-400">30天</span>}
        {total === 100 && (
          <>
            <span className="text-gray-400">30天</span>
            <span className="text-gray-400">100天</span>
          </>
        )}
        {total === 200 && (
          <>
            <span className="text-gray-400">30天</span>
            <span className="text-gray-400">100天</span>
            <span className="text-gray-400">200天</span>
          </>
        )}
        {total === 365 && (
          <>
            <span className="text-gray-400">100天</span>
            <span className="text-gray-400">200天</span>
            <span className="text-gray-400">365天</span>
          </>
        )}
      </div>
    </div>
  );
}
