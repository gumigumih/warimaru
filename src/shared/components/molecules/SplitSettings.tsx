import type { RoundingOptions, SplitOptions } from '../../domain/split';
import { allocateAmount, roundAmount, roundingLabels } from '../../domain/split';
import { AmountInput } from '../atoms/AmountInput';

const fieldClass = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-base font-normal text-slate-900';

export const RoundingSettings = ({ options, onChange }: {
  options: RoundingOptions;
  onChange: (options: RoundingOptions) => void;
}) => {
  const exampleTotal = options.roundingUnit === 1 ? 10001 : options.roundingUnit * 10.5;
  const example = allocateAmount(exampleTotal, [1, 1, 1], options, 0);
  const rounded = roundAmount(exampleTotal / 3, options);
  return <div className="space-y-3">
  <div className="grid gap-3 sm:grid-cols-3">
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      丸める単位
      <select className={fieldClass} value={options.roundingUnit} onChange={event => onChange({ ...options, roundingUnit: Number(event.target.value) as RoundingOptions['roundingUnit'] })}>
        <option value="1">1円単位</option>
        <option value="100">100円単位</option>
        <option value="500">500円単位</option>
        <option value="1000">1,000円単位</option>
      </select>
    </label>
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      丸め方
      <select className={fieldClass} value={options.roundingMode ?? 'floor'} onChange={event => onChange({ ...options, roundingMode: event.target.value as RoundingOptions['roundingMode'] })}>
        <option value="floor">切り捨て</option>
        <option value="ceil">切り上げ</option>
        <option value="nearest">四捨五入</option>
      </select>
    </label>
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      差額の負担
      <select className={fieldClass} value={options.remainderRecipient} onChange={event => onChange({ ...options, remainderRecipient: event.target.value as RoundingOptions['remainderRecipient'] })}>
        <option value="fraction">全員で調整する</option>
        <option value="payer">立替者で調整する</option>
      </select>
    </label>
  </div>
  <p className="text-xs leading-relaxed text-slate-500">各人の負担額を丸めた後、会計額との差額を追加・減額して、合計を合わせます。差額を調整する人は、丸めた金額から変わる場合があります。</p>
  <div className="rounded-lg bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
    <p>例：{exampleTotal.toLocaleString()}円を3人で均等に割ると</p>
    <p>{roundingLabels[options.roundingMode ?? 'floor']}後は1人 {rounded.toLocaleString()}円。{rounded * 3 <= exampleTotal ? '不足' : '超過'} {(Math.abs(exampleTotal - rounded * 3)).toLocaleString()}円を調整します。</p>
    <p>調整後：立替者 {example[0].toLocaleString()}円 ／ 2人目 {example[1].toLocaleString()}円 ／ 3人目 {example[2].toLocaleString()}円</p>
  </div>
  {options.remainderRecipient === 'payer' && <p className="text-xs leading-relaxed text-slate-500">入力順で最初の負担対象の立替者で調整します。項目別でも、各人の負担を合算してから丸めます。該当者がいない場合や、立替者の負担額を超える減額が必要な場合は、全員で調整します。</p>}
  <p className="text-xs leading-relaxed text-slate-500">単位未満の金額が出る場合もあります。その端数は1人にまとめます。</p>
</div>;
};

export const AccountingSettings = ({ options, onChange }: {
  options: SplitOptions;
  onChange: (options: SplitOptions) => void;
}) => <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
  <summary className="cursor-pointer text-sm font-bold text-slate-800">税・サービス料・割引（任意）</summary>
  <div className="mt-3 grid gap-3 sm:grid-cols-3">
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      税率（%）
      <input className={fieldClass} type="number" min="0" max="10000" step="0.1" placeholder="0" value={options.taxRate} onChange={event => onChange({ ...options, taxRate: event.target.value })} />
    </label>
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      サービス料（%）
      <input className={fieldClass} type="number" min="0" max="10000" step="0.1" placeholder="0" value={options.serviceRate} onChange={event => onChange({ ...options, serviceRate: event.target.value })} />
    </label>
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      割引額
      <AmountInput className={fieldClass} placeholder="0" title="割引額を入力" value={options.discount} onChange={discount => onChange({ ...options, discount })} />
    </label>
  </div>
  <p className="mt-3 text-xs leading-relaxed text-slate-500">税とサービス料は入力金額に加算し、最後に割引を引きます。税込の金額を入力した場合、税率は0のままにしてください。項目別では元の金額に比例して各項目へ配分します。</p>
</details>;
