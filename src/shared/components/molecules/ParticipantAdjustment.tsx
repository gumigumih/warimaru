import { Checkbox } from '../atoms/Checkbox';

export interface ParticipantAdjustmentValue {
  burdenRate: number;
  displayOnly: boolean;
}

export const ParticipantAdjustment = ({ value, onChange, hasPayment = false }: {
  value: ParticipantAdjustmentValue;
  onChange: (value: ParticipantAdjustmentValue) => void;
  hasPayment?: boolean;
}) => <div className="flex flex-wrap items-center gap-4">
  <label className="flex items-center gap-2 text-sm text-slate-700">
    負担率
    <input type="number" min="0" max="10000" step="1" value={Number((value.burdenRate * 100).toFixed(4))}
      onChange={event => onChange({ ...value, burdenRate: Number(event.target.value) / 100 })}
      disabled={value.displayOnly} className="h-10 w-24 rounded-lg border border-slate-200 bg-white px-2 text-right disabled:bg-slate-100 disabled:text-slate-400" />
    <span>%</span>
  </label>
  <Checkbox checked={value.displayOnly} disabled={hasPayment} onChange={event => onChange({ ...value, displayOnly: event.target.checked })}>
    表示のみ（精算対象外）
  </Checkbox>
  {hasPayment && <span className="text-xs text-slate-500">立替者は精算対象に残ります。</span>}
</div>;
