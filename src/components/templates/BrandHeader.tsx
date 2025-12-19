interface BrandHeaderProps {
  logoSrc: string;
  alt: string;
  tag: string;
  title: string;
  subtitle: string;
  accent: string; // Tailwind bg gradient classes (e.g., "bg-gradient-to-r from-blue-500 ...")
}

export const BrandHeader = ({ logoSrc, alt, tag, title, subtitle, accent }: BrandHeaderProps) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 mb-4 shadow-md text-white border border-white/20 ${accent}`}>
      <div className="flex items-center gap-3">
        <div className="h-12 sm:h-14 min-w-[78px] sm:min-w-[92px] rounded-2xl bg-white/20 flex items-center justify-center shadow-md px-3">
          <img src={logoSrc} alt={alt} className="h-8 sm:h-9 w-auto max-w-full object-contain" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/80">{tag}</p>
          <p className="text-lg sm:text-xl font-semibold text-white leading-tight drop-shadow-sm">{title}</p>
          <p className="text-sm text-white/90">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
