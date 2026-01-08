import Link from 'next/link';
import Header from '@/components/layout/header';
import StatsFooter from '@/components/layout/stats-footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background-dark to-background-dark" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl w-full py-20">
          <div className="text-center space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="block text-white">CAPTURE YOUR</span>
                <span className="block bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
                  JOURNEY
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                通过打卡获得奖励，每个目的地都值得被记录
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                href="/daily-checkin/stake"
                className="flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-10 py-5 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:scale-105 animate-glow shadow-[0_0_30px_rgba(37,244,120,0.5)] min-w-[200px]"
              >
                <span className="material-symbols-outlined text-2xl">
                  rocket_launch
                </span>
                <span>立即开始</span>
              </Link>

              <Link
                href="/spot-checkin"
                className="flex items-center justify-center gap-3 glass-panel hover:border-primary text-white px-10 py-5 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                <span className="material-symbols-outlined text-2xl">
                  explore
                </span>
                <span>探索景点</span>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
              {/* 每日打卡 */}
              <Link href="/daily-checkin/calendar">
                <div className="glass-panel p-6 rounded-xl hover:border-primary transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="size-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-background-dark text-3xl">
                        calendar_today
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        每日打卡
                      </h3>
                      <p className="text-sm text-gray-400">
                        坚持打卡，完成里程碑，获得丰厚奖励
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 景点打卡 */}
              <Link href="/spot-checkin">
                <div className="glass-panel p-6 rounded-xl hover:border-primary transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-3xl">
                        location_on
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        景点打卡
                      </h3>
                      <p className="text-sm text-gray-400">
                        探索世界，记录美景，赚取利息收益
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 幸运转盘 */}
              <Link href="/rewards/lottery">
                <div className="glass-panel p-6 rounded-xl hover:border-primary transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="size-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-3xl">
                        casino
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        幸运转盘
                      </h3>
                      <p className="text-sm text-gray-400">
                        抽取奖励，获得代币、补卡次数和徽章
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* 特性说明 */}
            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">100%</p>
                <p className="text-sm text-gray-400">去中心化</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">24/7</p>
                <p className="text-sm text-gray-400">随时打卡</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">10%+</p>
                <p className="text-sm text-gray-400">年化收益</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">安全</p>
                <p className="text-sm text-gray-400">链上保障</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="material-symbols-outlined text-primary text-4xl">
            expand_more
          </span>
        </div>
      </main>

      {/* Stats Section */}
      <StatsFooter />

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <span className="material-symbols-outlined text-background-dark text-sm">
                travel_explore
              </span>
            </div>
            <span className="font-bold">TravelCheck</span>
            <span className="text-sm text-gray-500">© 2026</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">
              关于我们
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              使用条款
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              帮助中心
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <span className="text-sm">𝕏</span>
            </a>
            <a
              href="#"
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <span className="text-sm">DC</span>
            </a>
            <a
              href="#"
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <span className="text-sm">TG</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
