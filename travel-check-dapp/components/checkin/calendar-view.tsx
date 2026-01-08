'use client';

import { useMemo } from 'react';

interface CalendarDay {
  date: number;
  status: 'checked' | 'missed' | 'makeup-available' | 'future' | 'empty';
  isToday: boolean;
}

interface CalendarViewProps {
  year: number;
  month: number;
  checkedDates: number[]; // 已打卡的日期
  missedDates: number[]; // 断卡的日期
  makeupAvailableDates: number[]; // 可补卡的日期
  onDateClick?: (date: number) => void;
}

export default function CalendarView({
  year,
  month,
  checkedDates,
  missedDates,
  makeupAvailableDates,
  onDateClick,
}: CalendarViewProps) {
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = isCurrentMonth ? today.getDate() : -1;

    const days: CalendarDay[] = [];

    // 填充前面的空白
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: 0,
        status: 'empty',
        isToday: false,
      });
    }

    // 填充实际日期
    for (let date = 1; date <= daysInMonth; date++) {
      let status: CalendarDay['status'] = 'future';

      if (checkedDates.includes(date)) {
        status = 'checked';
      } else if (missedDates.includes(date)) {
        status = 'missed';
      } else if (makeupAvailableDates.includes(date)) {
        status = 'makeup-available';
      } else if (date < todayDate) {
        status = 'future'; // 过去但未标记的日期
      }

      days.push({
        date,
        status,
        isToday: date === todayDate,
      });
    }

    return days;
  }, [year, month, checkedDates, missedDates, makeupAvailableDates]);

  const getStatusIcon = (status: CalendarDay['status']) => {
    switch (status) {
      case 'checked':
        return '✅';
      case 'missed':
        return '❌';
      case 'makeup-available':
        return '🔄';
      default:
        return '';
    }
  };

  const getStatusColor = (status: CalendarDay['status']) => {
    switch (status) {
      case 'checked':
        return 'border-primary bg-primary/10';
      case 'missed':
        return 'border-red-500 bg-red-500/10';
      case 'makeup-available':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="space-y-4">
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-400 pb-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历格子 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day.status === 'empty') {
            return <div key={`empty-${index}`} />;
          }

          const isClickable = day.status === 'makeup-available' || day.isToday;

          return (
            <button
              key={day.date}
              onClick={() => isClickable && onDateClick?.(day.date)}
              disabled={!isClickable}
              className={`
                aspect-square rounded-lg border-2 transition-all duration-300
                flex flex-col items-center justify-center gap-1
                ${getStatusColor(day.status)}
                ${day.isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-dark' : ''}
                ${isClickable ? 'hover:scale-105 hover:border-primary cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className={`text-lg font-bold ${day.isToday ? 'text-primary' : 'text-white'}`}>
                {day.date}
              </span>
              {day.status !== 'future' && (
                <span className="text-xl leading-none">
                  {getStatusIcon(day.status)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 pt-4 text-sm">
        <div className="flex items-center gap-2">
          <span>✅</span>
          <span className="text-gray-400">已打卡</span>
        </div>
        <div className="flex items-center gap-2">
          <span>❌</span>
          <span className="text-gray-400">已断卡</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔄</span>
          <span className="text-gray-400">可补卡</span>
        </div>
      </div>
    </div>
  );
}
