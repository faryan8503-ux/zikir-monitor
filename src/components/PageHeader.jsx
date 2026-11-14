// Bar atas untuk halaman selain skrin utama
export default function PageHeader({ title, subtitle, onBack, right }) {
  return (
    <header className="sticky top-0 z-20 -mx-5 mb-4 flex items-center gap-3 bg-cream/85 px-5 pb-3 backdrop-blur-md"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
      <button type="button" onClick={onBack} aria-label="Kembali"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-blush-500 shadow-soft ring-1 ring-blush-100 transition active:scale-90">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-plum">{title}</h1>
        {subtitle && <p className="truncate text-xs font-medium text-plum-soft">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
