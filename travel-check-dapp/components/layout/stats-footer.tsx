'use client';

export default function StatsFooter() {
  // TODO: 从智能合约获取实时数据
  const stats = {
    globalParticipants: 12845,
    milestonesAchieved: 3256,
    todayCheckIns: 1892,
  };

  return (
    <div className="w-full px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 全球参与者 */}
          <div className="glass-panel p-8 rounded-xl hover:border-primary transition-all duration-300 group">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">
                  group
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-white mb-1">
                  {stats.globalParticipants.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">全球参与者</p>
              </div>
            </div>
          </div>

          {/* 里程碑达成者 */}
          <div className="glass-panel p-8 rounded-xl hover:border-primary transition-all duration-300 group">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="size-16 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-yellow-500 text-3xl">
                  emoji_events
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-white mb-1">
                  {stats.milestonesAchieved.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">里程碑达成者</p>
              </div>
            </div>
          </div>

          {/* 今日打卡 */}
          <div className="glass-panel p-8 rounded-xl hover:border-primary transition-all duration-300 group">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="size-16 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-blue-500 text-3xl">
                  task_alt
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-white mb-1">
                  {stats.todayCheckIns.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">今日打卡</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
