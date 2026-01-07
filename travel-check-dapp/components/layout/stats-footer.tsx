'use client';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  trend?: string;
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="glass-panel rounded-xl p-5 flex items-center gap-4 hover:bg-black/50 transition-colors cursor-default group">
      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors duration-300">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-300 text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-white text-2xl font-bold font-display tracking-tight">
            {value}
          </span>
          {trend && (
            <span className="text-xs text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">trending_up</span>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StatsFooter() {
  return (
    <footer className="w-full px-4 pb-8 pt-4 z-20">
      <div className="mx-auto max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon="groups" label="全球参与者" value="12,450" />
          <StatCard icon="emoji_events" label="里程碑达成者" value="3,200" />
          <StatCard icon="today" label="今日打卡" value="458" trend="+12%" />
        </div>
      </div>
    </footer>
  );
}
