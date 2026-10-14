import type { ReactNode } from 'react';

interface StepIntroProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  accentClassName?: string;
  action?: ReactNode;
  endAction?: ReactNode;
  children?: ReactNode;
}

export const StepIntro = ({
  currentStep,
  totalSteps,
  title,
  description,
  action,
  endAction,
  children,
}: StepIntroProps) => {
  return (
    <section className="space-y-2">
      <div className="relative flex min-h-[72px] items-center">
        <div className="min-w-0">{action}</div>
        {endAction && <div className="ml-auto">{endAction}</div>}
        <div className="pointer-events-none absolute left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 flex-col items-center justify-center rounded-xl bg-slate-700 text-center font-extrabold uppercase text-white shadow-sm">
          <span className="text-[11px] leading-none tracking-[0.06em] text-white/60">Step</span>
          <span className="mt-0.5 text-3xl leading-none text-white">{currentStep}</span>
          <span className="mt-0.5 text-[11px] leading-none text-white/60">/ {totalSteps}</span>
        </div>
      </div>

      <div className="px-1 py-2 text-center sm:px-0">
        <div className="mx-auto max-w-2xl space-y-1">
          <h2 className="text-xl font-extrabold leading-tight text-slate-950">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </section>
  );
};
