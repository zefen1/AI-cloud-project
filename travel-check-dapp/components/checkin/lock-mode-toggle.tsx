'use client';

interface LockModeToggleProps {
  isLocked: boolean;
  onChange: (isLocked: boolean) => void;
}

export default function LockModeToggle({ isLocked, onChange }: LockModeToggleProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300">锁定方式</label>
      <div className="grid grid-cols-2 gap-3">
        {/* 封存模式 */}
        <button
          onClick={() => onChange(true)}
          className={`
            glass-panel p-4 rounded-xl transition-all duration-300 text-left
            ${isLocked
              ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(37,244,120,0.3)]'
              : 'border-white/10 hover:border-primary/50'
            }
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">lock</span>
            <span className="font-bold text-white">封存模式</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            必须完成里程碑才能取回本金和利息
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">红包范围:</span>
            <span className="text-primary font-bold text-sm">1‰ ~ 3‰</span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-400">利息: </span>
            <span className="text-primary font-bold text-sm">全额</span>
          </div>
        </button>

        {/* 随时可取模式 */}
        <button
          onClick={() => onChange(false)}
          className={`
            glass-panel p-4 rounded-xl transition-all duration-300 text-left
            ${!isLocked
              ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(37,244,120,0.3)]'
              : 'border-white/10 hover:border-primary/50'
            }
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">lock_open</span>
            <span className="font-bold text-white">随时可取</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            可随时取回本金，但利息减半
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">红包范围:</span>
            <span className="text-primary font-bold text-sm">0.3‰ ~ 0.6‰</span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-400">利息: </span>
            <span className="text-yellow-500 font-bold text-sm">50%</span>
          </div>
        </button>
      </div>
    </div>
  );
}
