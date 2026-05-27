import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface BrandHeaderProps {
  icon: IconDefinition;
  tag: string;
  title: string;
  subtitle: string;
  accent: string; // Tailwind bg gradient classes (e.g., "bg-gradient-to-r from-blue-500 ...")
}

export const BrandHeader = ({ icon, tag, title, subtitle, accent }: BrandHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        ツール一覧へ
      </button>

      <div className={`relative overflow-hidden rounded-lg p-4 sm:p-5 mb-4 shadow-md text-white border border-white/20 ${accent}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white shadow-md ring-1 ring-white/20">
            <FontAwesomeIcon icon={icon} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.08em] text-white/80">{tag}</p>
            <p className="text-lg sm:text-xl font-semibold text-white leading-tight drop-shadow-sm">{title}</p>
            <p className="text-sm text-white/90">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
