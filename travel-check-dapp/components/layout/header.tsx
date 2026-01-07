'use client';

export default function Header() {
  return (
    <header className="w-full px-6 py-6 z-20">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary">
            <span className="material-symbols-outlined text-2xl">public</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
            TravelCheck
          </h1>
        </div>

        {/* Wallet Connection Button */}
        <button className="group flex items-center gap-2 h-10 px-5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-xl">
            account_balance_wallet
          </span>
          <span className="text-sm font-bold tracking-wide">Connect Wallet</span>
        </button>
      </div>
    </header>
  );
}
