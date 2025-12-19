interface BackgroundProps {
  children: React.ReactNode;
}

export const Background = ({ children }: BackgroundProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#dcefff] via-[#c8e6ff] to-[#b7dcff] text-[#0f1f3a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,197,255,0.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(37,110,245,0.2),transparent_32%),radial-gradient(circle_at_40%_80%,rgba(14,165,233,0.18),transparent_30%)]" />
      <div className="absolute inset-0 background-grid opacity-15" />
      <div className="absolute -left-24 -top-16 h-72 w-72 bg-gradient-to-br from-white/60 via-sky-200/70 to-indigo-200/50 blur-3xl rounded-full" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 bg-gradient-to-tr from-sky-200/70 via-cyan-200/70 to-white/60 blur-3xl rounded-full" />
      <div className="relative max-w-3xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-12">
        {children}
      </div>
    </div>
  )
}
