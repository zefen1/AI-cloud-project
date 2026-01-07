import Header from '@/components/layout/header';
import StatsFooter from '@/components/layout/stats-footer';

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col bg-background-dark bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')",
      }}
    >
      {/* Top Navigation */}
      <Header />

      {/* Hero Content (Centered) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center gap-6 max-w-3xl animate-fade-in-up">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live on Mainnet
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-lg">
            CAPTURE YOUR <br /> JOURNEY
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 font-medium max-w-lg leading-relaxed drop-shadow-md">
            Earn rewards for every destination you visit. Join the decentralized
            travel network today.
          </p>

          {/* CTA Button */}
          <button className="mt-4 flex items-center gap-3 bg-primary hover:bg-primary-hover text-background-dark px-8 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:scale-105 animate-glow shadow-[0_0_20px_rgba(37,244,120,0.4)]">
            <span className="material-symbols-outlined">where_to_vote</span>
            <span>立即打卡</span>
          </button>
        </div>
      </main>

      {/* Stats Footer (Bottom) */}
      <StatsFooter />
    </div>
  );
}
