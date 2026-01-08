'use client';

import { useState } from 'react';

interface Milestone {
  days: number;
  lockedInterest: number;
  flexibleInterest: number;
  badge: string;
  title: string;
}

const MILESTONES: Milestone[] = [
  { days: 30, lockedInterest: 5, flexibleInterest: 2.5, badge: '🌱', title: '旅行新芽' },
  { days: 100, lockedInterest: 8, flexibleInterest: 4, badge: '⭐', title: '旅行达人' },
  { days: 200, lockedInterest: 14, flexibleInterest: 7, badge: '🌟', title: '探险家' },
  { days: 365, lockedInterest: 20, flexibleInterest: 10, badge: '👑', title: '旅行大师' },
];

interface MilestoneSelectorProps {
  selected: number;
  onSelect: (days: number) => void;
  isLocked: boolean;
}

export default function MilestoneSelector({ selected, onSelect, isLocked }: MilestoneSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300">选择里程碑</label>
      <div className="grid grid-cols-2 gap-3">
        {MILESTONES.map((milestone) => {
          const isSelected = selected === milestone.days;
          const interest = isLocked ? milestone.lockedInterest : milestone.flexibleInterest;

          return (
            <button
              key={milestone.days}
              onClick={() => onSelect(milestone.days)}
              className={`
                glass-panel p-4 rounded-xl transition-all duration-300
                ${isSelected
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(37,244,120,0.3)]'
                  : 'border-white/10 hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{milestone.badge}</span>
                <div className="text-left">
                  <div className="font-bold text-white">{milestone.days} 天</div>
                  <div className="text-xs text-gray-400">{milestone.title}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-gray-400">利息率</span>
                <span className="text-primary font-bold">{interest}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { MILESTONES };
export type { Milestone };
