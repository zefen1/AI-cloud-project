'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full px-6 py-6 fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background-dark/80 border-b border-white/10">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-background-dark text-xl">
              travel_explore
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight">TravelCheck</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/daily-checkin/calendar"
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            每日打卡
          </Link>
          <Link
            href="/spot-checkin"
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            景点打卡
          </Link>
          <Link
            href="/rewards/lottery"
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            幸运转盘
          </Link>
          <Link
            href="/rewards/achievements"
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            成就墙
          </Link>
        </nav>

        {/* Connect Wallet Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="hidden md:flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background-dark px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(37,244,120,0.4)]">
            <span className="material-symbols-outlined text-base">wallet</span>
            <span>Connect Wallet</span>
          </button>
        </div>
      </div>
    </header>
  );
}
