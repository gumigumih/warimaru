import { forwardRef, type ReactNode } from 'react';

interface ResultReportCardProps {
  accentGradient: string;
  reportLabel: string;
  subtitle: string;
  totalLabel?: string;
  total: string;
  participantSummary: string;
  children: ReactNode;
}

export const ResultReportCard = forwardRef<HTMLDivElement, ResultReportCardProps>(function ResultReportCard({
  accentGradient,
  reportLabel,
  subtitle,
  totalLabel = '合計',
  total,
  participantSummary,
  children,
}, ref) {
  return (
    <div ref={ref} className="glass-card p-0 overflow-hidden shadow-2xl">
      <div className={`bg-gradient-to-r ${accentGradient} text-white px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] opacity-90">{reportLabel}</p>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">計算結果を共有しましょう</h2>
          <p className="text-sm opacity-90">{subtitle}</p>
        </div>
        <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 text-right min-w-[180px]">
          <p className="text-xs opacity-80">{totalLabel}</p>
          <p className="text-2xl font-semibold leading-tight">{total}</p>
          <p className="text-xs opacity-80">{participantSummary}</p>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-b from-white via-white to-slate-50">
        {children}
      </div>
    </div>
  );
});
