'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalendarView from '@/components/checkin/calendar-view';
import ProgressBar from '@/components/checkin/progress-bar';

export default function CalendarPage() {
  const [currentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // TODO: 从智能合约获取数据
  const mockData = {
    milestoneDays: 100, // 目标天数
    currentDay: 23, // 当前打卡天数
    remainingMakeups: 2, // 剩余补卡次数
    totalMakeups: 3, // 总补卡次数
    checkedDates: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31], // 已打卡日期
    missedDates: [6, 13, 20], // 断卡日期
    makeupAvailableDates: [6, 13], // 可补卡日期 (20号已经无法补卡)
    isCheckedToday: false, // 今天是否已打卡
  };

  const handleDateClick = (date: number) => {
    if (mockData.makeupAvailableDates.includes(date)) {
      window.location.href = '/daily-checkin/makeup';
    } else if (date === currentDate.getDate() && !mockData.isCheckedToday) {
      window.location.href = '/daily-checkin/task';
    }
  };

  const handleCheckInToday = () => {
    window.location.href = '/daily-checkin/task';
  };

  const handleMakeup = () => {
    window.location.href = '/daily-checkin/makeup';
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
          <h1 className="text-2xl font-bold">每日打卡 - 日历</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 日历 */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6 rounded-xl">
              {/* 月份标题 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {year}年 {month + 1}月
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="material-symbols-outlined text-primary text-base">
                    calendar_today
                  </span>
                  <span>打卡记录</span>
                </div>
              </div>

              {/* 日历视图 */}
              <CalendarView
                year={year}
                month={month}
                checkedDates={mockData.checkedDates}
                missedDates={mockData.missedDates}
                makeupAvailableDates={mockData.makeupAvailableDates}
                onDateClick={handleDateClick}
              />
            </div>
          </div>

          {/* Right Column - 进度和操作 */}
          <div className="space-y-6">
            {/* 打卡进度 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  trending_up
                </span>
                打卡进度
              </h3>
              <ProgressBar
                current={mockData.currentDay}
                total={mockData.milestoneDays}
              />

              {/* 里程碑徽章 */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">目标里程碑</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="font-bold">旅行达人</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 补卡次数 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  restore
                </span>
                补卡机会
              </h3>

              {/* 补卡次数显示 */}
              <div className="flex items-center justify-center gap-3 py-4">
                {[...Array(mockData.totalMakeups)].map((_, index) => (
                  <div
                    key={index}
                    className={`size-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
                      index < mockData.remainingMakeups
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-gray-600 bg-gray-600/20 text-gray-600'
                    }`}
                  >
                    🔄
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  剩余 <span className="text-primary font-bold">{mockData.remainingMakeups}</span> 次补卡机会
                </p>
              </div>

              {mockData.remainingMakeups > 0 && mockData.makeupAvailableDates.length > 0 && (
                <button
                  onClick={handleMakeup}
                  className="w-full glass-panel py-3 rounded-lg hover:border-primary transition-all text-sm font-medium"
                >
                  立即补卡
                </button>
              )}
            </div>

            {/* 今日打卡 */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  task_alt
                </span>
                今日打卡
              </h3>

              {mockData.isCheckedToday ? (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-4xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-400">今日已完成打卡</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-400">
                    完成今日任务，获得红包奖励
                  </p>
                  <button
                    onClick={handleCheckInToday}
                    className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-6 py-4 rounded-full font-bold text-base tracking-wide transition-all duration-300 hover:scale-105 animate-glow shadow-[0_0_20px_rgba(37,244,120,0.4)]"
                  >
                    <span className="material-symbols-outlined">edit_note</span>
                    <span>开始打卡</span>
                  </button>
                </>
              )}
            </div>

            {/* 说明文字 */}
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">info</span>
                打卡规则
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>每天00:00刷新打卡任务</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>完成任务后立即获得红包奖励</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>断卡后有3次补卡机会</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>补卡任务难度更高</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>达成里程碑获得专属徽章</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
