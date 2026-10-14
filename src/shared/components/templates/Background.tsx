interface BackgroundProps {
  children: React.ReactNode;
}

export const Background = ({ children }: BackgroundProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f7f9fc] text-[#0f1f3a]">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f7f9fc] to-[#eef4fb]" />
      <div className="absolute inset-0 background-grid opacity-10" />
      <div className="relative max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-14">
        {children}
      </div>
    </div>
  )
}
