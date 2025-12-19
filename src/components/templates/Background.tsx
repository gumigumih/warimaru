interface BackgroundProps {
  children: React.ReactNode;
}

export const Background = ({ children }: BackgroundProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f7f9fc] text-[#0f1f3a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.06),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.06),transparent_28%)]" />
      <div className="absolute inset-0 background-grid opacity-10" />
      <div className="absolute -left-24 -top-16 h-72 w-72 bg-gradient-to-br from-white/70 via-slate-100/80 to-slate-200/60 blur-3xl rounded-full" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 bg-gradient-to-tr from-white/70 via-slate-100/80 to-slate-200/60 blur-3xl rounded-full" />
      <div className="relative max-w-3xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-12">
        {children}
      </div>
    </div>
  )
}
