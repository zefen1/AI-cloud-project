'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MakeupTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  minWords: number;
  icon: string;
}

const MAKEUP_TASKS: MakeupTask[] = [
  {
    id: 'double-strategy',
    title: '双倍攻略',
    description: '发布一篇详细的旅游攻略，字数要求翻倍',
    difficulty: 'medium',
    minWords: 400,
    icon: '📝',
  },
  {
    id: 'photo-essay',
    title: '精品图文',
    description: '上传至少5张高质量照片，配文不少于300字',
    difficulty: 'medium',
    minWords: 300,
    icon: '📸',
  },
  {
    id: 'video-checkin',
    title: '视频打卡',
    description: '上传不少于30秒的旅行视频，配文不少于200字',
    difficulty: 'hard',
    minWords: 200,
    icon: '🎥',
  },
];

export default function MakeupPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTask = MAKEUP_TASKS.find((task) => task.id === selectedTask);
  const currentWords = content.length;
  const isValid = currentTask ? currentWords >= currentTask.minWords : false;

  const getDifficultyColor = (difficulty: MakeupTask['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
    }
  };

  const getDifficultyLabel = (difficulty: MakeupTask['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
    }
  };

  const handleSubmit = async () => {
    if (!isValid || !currentTask) return;

    setIsSubmitting(true);

    // TODO: 调用智能合约提交补卡内容
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    alert('补卡成功！');
    window.location.href = '/daily-checkin/calendar';
  };

  if (!selectedTask) {
    return (
      <div className="min-h-screen bg-background-dark">
        {/* Header */}
        <header className="w-full px-6 py-6 border-b border-white/10">
          <div className="mx-auto max-w-7xl flex items-center gap-4">
            <Link
              href="/daily-checkin/calendar"
              className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold">补卡任务</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-6">
            {/* 说明 */}
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  info
                </span>
                补卡说明
              </h2>
              <p className="text-gray-400 mb-4">
                选择一个补卡任务完成，即可补回之前断掉的打卡记录。补卡任务难度较高，请认真完成。
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    restore
                  </span>
                  <span className="text-gray-400">剩余补卡次数: 2/3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-500 text-base">
                    warning
                  </span>
                  <span className="text-gray-400">补卡无红包奖励</span>
                </div>
              </div>
            </div>

            {/* 任务选择 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">选择补卡任务</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MAKEUP_TASKS.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task.id)}
                    className="glass-panel p-6 rounded-xl hover:border-primary transition-all text-left space-y-4 group"
                  >
                    {/* 图标和难度 */}
                    <div className="flex items-start justify-between">
                      <span className="text-4xl">{task.icon}</span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full border ${getDifficultyColor(
                          task.difficulty
                        )} border-current`}
                      >
                        {getDifficultyLabel(task.difficulty)}
                      </span>
                    </div>

                    {/* 标题 */}
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>

                    {/* 描述 */}
                    <p className="text-sm text-gray-400">{task.description}</p>

                    {/* 要求 */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="material-symbols-outlined text-sm">
                        text_fields
                      </span>
                      <span>最少 {task.minWords} 字</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 提示 */}
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">
                  tips_and_updates
                </span>
                温馨提示
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>补卡任务难度较普通打卡更高</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>每个断卡日期只能补卡一次</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>补卡成功后不会获得红包奖励</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>超过3次断卡后无法再补卡</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <header className="w-full px-6 py-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <button
            onClick={() => setSelectedTask(null)}
            className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold">{currentTask?.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* 任务说明 */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <span className="text-5xl">{currentTask?.icon}</span>
              <div className="flex-1 space-y-3">
                <h2 className="text-xl font-bold">{currentTask?.title}</h2>
                <p className="text-gray-400">{currentTask?.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${getDifficultyColor(
                        currentTask?.difficulty || 'medium'
                      )}`}
                    >
                      难度: {getDifficultyLabel(currentTask?.difficulty || 'medium')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">
                      text_fields
                    </span>
                    <span className="text-gray-400">
                      最少 {currentTask?.minWords} 字
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 内容编辑器 */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                任务内容
              </label>
              <span
                className={`text-sm font-bold ${
                  isValid ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {currentWords} / {currentTask?.minWords} 字
              </span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="完成补卡任务..."
              className="w-full h-80 bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-white resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />

            {!isValid && currentWords > 0 && (
              <p className="text-sm text-yellow-500">
                还需要 {(currentTask?.minWords || 0) - currentWords} 字才能提交
              </p>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-8 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:scale-105 animate-glow shadow-[0_0_20px_rgba(37,244,120,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:animate-none"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">
                  progress_activity
                </span>
                <span>提交中...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                <span>提交补卡</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
