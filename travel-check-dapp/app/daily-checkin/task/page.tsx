'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TaskPage() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRedPacket, setShowRedPacket] = useState(false);

  const minWords = 200;
  const currentWords = content.length;
  const isValid = currentWords >= minWords;

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);

    // TODO: 调用智能合约提交打卡内容
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowRedPacket(true);
  };

  const handleClaimRedPacket = () => {
    // TODO: 调用智能合约领取红包
    alert('红包已领取！');
    window.location.href = '/daily-checkin/calendar';
  };

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
          <h1 className="text-2xl font-bold">今日打卡任务</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* 任务说明 */}
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                description
              </span>
              任务类型：发布旅游攻略
            </h2>
            <p className="text-gray-400 mb-4">
              分享你的旅行经验、景点推荐或旅游攻略，至少200字。
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  schedule
                </span>
                <span className="text-gray-400">截止时间: 今日 23:59</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  paid
                </span>
                <span className="text-gray-400">奖励: 随机红包 5-50 代币</span>
              </div>
            </div>
          </div>

          {/* 内容编辑器 */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                攻略内容
              </label>
              <span
                className={`text-sm font-bold ${
                  isValid ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {currentWords} / {minWords} 字
              </span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的旅行故事...&#10;&#10;例如：&#10;- 景点推荐和亮点&#10;- 旅行路线和时间安排&#10;- 美食和住宿建议&#10;- 实用小贴士"
              className="w-full h-80 bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-white resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />

            {!isValid && currentWords > 0 && (
              <p className="text-sm text-yellow-500">
                还需要 {minWords - currentWords} 字才能提交
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
                <span>提交打卡</span>
              </>
            )}
          </button>

          {/* 说明文字 */}
          <div className="glass-panel p-4 rounded-xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">
                info
              </span>
              注意事项
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>内容需原创，禁止抄袭</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>提交后不可修改，请仔细检查</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>红包将在提交成功后立即发放</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>每天只能完成一次打卡任务</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* 红包弹窗 */}
      {showRedPacket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-2xl max-w-md w-full mx-4 space-y-6 animate-in fade-in zoom-in duration-300">
            {/* 红包图标 */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="size-32 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center animate-pulse">
                  <span className="text-6xl">🧧</span>
                </div>
                <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary flex items-center justify-center animate-bounce">
                  <span className="material-symbols-outlined text-background-dark text-sm">
                    check
                  </span>
                </div>
              </div>
            </div>

            {/* 标题 */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">打卡成功！</h3>
              <p className="text-gray-400">恭喜你获得今日红包奖励</p>
            </div>

            {/* 红包金额 */}
            <div className="glass-panel p-6 rounded-xl text-center space-y-2">
              <p className="text-sm text-gray-400">红包金额</p>
              <p className="text-4xl font-bold text-primary">
                {Math.floor(Math.random() * 46) + 5}
                <span className="text-xl ml-2">代币</span>
              </p>
            </div>

            {/* 按钮 */}
            <div className="space-y-3">
              <button
                onClick={handleClaimRedPacket}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-6 py-4 rounded-full font-bold text-base tracking-wide transition-all duration-300 hover:scale-105"
              >
                <span className="material-symbols-outlined">redeem</span>
                <span>领取红包</span>
              </button>
              <button
                onClick={() => setShowRedPacket(false)}
                className="w-full glass-panel py-3 rounded-full hover:border-primary transition-all text-sm font-medium"
              >
                稍后领取
              </button>
            </div>

            {/* 提示 */}
            <p className="text-xs text-center text-gray-500">
              红包将在24小时后过期，请及时领取
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
