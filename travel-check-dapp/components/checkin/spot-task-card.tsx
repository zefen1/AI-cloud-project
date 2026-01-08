'use client';

import Link from 'next/link';

export interface SpotTask {
  id: string;
  name: string;
  location: string;
  image: string;
  deadline: string;
  minStake: number;
  maxStake: number;
  dailyInterest: number;
  totalReward: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'expired';
}

interface SpotTaskCardProps {
  task: SpotTask;
}

export default function SpotTaskCard({ task }: SpotTaskCardProps) {
  const getDifficultyColor = (difficulty: SpotTask['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-500 border-green-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      case 'hard':
        return 'bg-red-500/20 text-red-500 border-red-500';
    }
  };

  const getDifficultyLabel = (difficulty: SpotTask['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
    }
  };

  const getStatusColor = (status: SpotTask['status']) => {
    switch (status) {
      case 'active':
        return 'bg-primary/20 text-primary border-primary';
      case 'completed':
        return 'bg-gray-500/20 text-gray-500 border-gray-500';
      case 'expired':
        return 'bg-red-500/20 text-red-500 border-red-500';
    }
  };

  const getStatusLabel = (status: SpotTask['status']) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'expired':
        return '已过期';
    }
  };

  return (
    <Link href={`/spot-checkin/${task.id}`}>
      <div className="glass-panel rounded-xl overflow-hidden hover:border-primary transition-all duration-300 group cursor-pointer">
        {/* 景点图片 */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
          {task.image ? (
            <img
              src={task.image}
              alt={task.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-white/20">
                landscape
              </span>
            </div>
          )}

          {/* 状态标签 */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getStatusColor(
                task.status
              )}`}
            >
              {getStatusLabel(task.status)}
            </span>
          </div>

          {/* 难度标签 */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getDifficultyColor(
                task.difficulty
              )}`}
            >
              {getDifficultyLabel(task.difficulty)}
            </span>
          </div>
        </div>

        {/* 任务信息 */}
        <div className="p-5 space-y-4">
          {/* 标题和地点 */}
          <div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
              {task.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>{task.location}</span>
            </div>
          </div>

          {/* 质押和奖励 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">质押要求</p>
              <p className="text-sm font-bold text-white">
                {task.minStake}-{task.maxStake}
                <span className="text-xs ml-1 text-gray-400">代币</span>
              </p>
            </div>
            <div className="glass-panel p-3 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">总奖励</p>
              <p className="text-sm font-bold text-primary">
                {task.totalReward}
                <span className="text-xs ml-1 text-gray-400">代币</span>
              </p>
            </div>
          </div>

          {/* 每日利息 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">每日利息</span>
            <span className="font-bold text-primary">{task.dailyInterest}%</span>
          </div>

          {/* 截止时间和参与人数 */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>截止: {task.deadline}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">group</span>
              <span>{task.participants} 人参与</span>
            </div>
          </div>

          {/* 参与按钮 */}
          {task.status === 'active' && (
            <button className="w-full bg-primary hover:bg-primary-hover text-background-dark py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">
                add_circle
              </span>
              <span>立即参与</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
