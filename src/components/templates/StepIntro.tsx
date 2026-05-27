import type { ReactNode } from 'react';

interface StepIntroProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  children?: ReactNode;
}

export const StepIntro = ({ currentStep, totalSteps, title, description, children }: StepIntroProps) => {
  return (
    <section className="glass-card p-4 bg-white/90 space-y-3">
      <div>
        <p className="text-sm text-slate-500">フェーズ {currentStep} / {totalSteps}</p>
        <h2 className="text-xl font-semibold text-slate-900 mt-1">{title}</h2>
        <p className="text-base text-slate-700 mt-1">{description}</p>
      </div>
      {children}
    </section>
  );
};
