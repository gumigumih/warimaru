import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { allocateAmount, adjustedAmount, defaultSplitOptions: defaults, parseAmount, settleBalances, roundAmount, decodeOptions } = await server.ssrLoadModule('/src/domain/split.ts');
  const { calculatePayments } = await server.ssrLoadModule('/src/waketabe/domain/usecases/calculatePayments.ts');
  const { calculateTransfers } = await server.ssrLoadModule('/src/waketabe/domain/usecases/calculateTransfers.ts');
  const { decodeMealShareData } = await server.ssrLoadModule('/src/waketabe/domain/usecases/shareData.ts');
  const { calculateEqualSettlement, equalMembers } = await server.ssrLoadModule('/src/warimaru/domain/usecases/settlement.ts');
  const { decodeEqualShareData } = await server.ssrLoadModule('/src/warimaru/domain/usecases/shareData.ts');
  const { calculateSimpleResult, decodeSimpleData } = await server.ssrLoadModule('/src/simple-warikan/calculation.ts');
  const { ParticipantInputStep } = await server.ssrLoadModule('/src/waketabe/pages/ParticipantInputStep.tsx');
  const { SettlementRouteList } = await server.ssrLoadModule('/src/warimaru/components/molecules/SettlementRouteList.tsx');
  const colors = { backgrounds: ['blue'], text: ['blue'] };
  const member = (id, burdenRate = 1, displayOnly = false) => ({ id, name: id, burdenRate, displayOnly });
  const payment = (id, amount) => ({ id, name: id, payments: [{ id: `${id}-pay`, amount, description: '' }] });
  const item = (id, price, eaters, paidBy = '') => ({ id, name: id, price: String(price), eaters, paidBy });
  const sum = values => values.reduce((total, value) => total + value, 0);

  assert.deepEqual(allocateAmount(1001, [1, 1, 1]), [334, 334, 333]);
  assert.deepEqual(allocateAmount(900, [1, 0.5, 0]), [600, 300, 0]);
  assert.deepEqual(allocateAmount(1001, [1, 1, 1], { roundingUnit: 100, remainderRecipient: 'payer' }, 2), [300, 300, 401]);
  assert.throws(() => allocateAmount(100, [0, 0]));
  assert.throws(() => allocateAmount(NaN, [1]));
  assert.ok(Number.isNaN(parseAmount('-100')));
  assert.equal(parseAmount('¥1,001'), 1001);
  assert.equal(adjustedAmount(10000, { ...defaults, taxRate: '10', serviceRate: '5', discount: '1000' }), 10500);
  assert.equal(adjustedAmount(100, { ...defaults, discount: '200' }), 0);

  assert.deepEqual(allocateAmount(10001, [1, 1, 1], { roundingUnit: 1000, remainderRecipient: 'payer' }, 0), [4001, 3000, 3000]);
  assert.deepEqual(allocateAmount(10500, [1, 1, 1], { roundingUnit: 1000, remainderRecipient: 'fraction' }), [4000, 3500, 3000]);
  assert.deepEqual(allocateAmount(10500, [1, 1, 1], { roundingUnit: 1000, remainderRecipient: 'payer' }, 0), [4500, 3000, 3000]);
  for (const [roundingMode, expected] of [['floor', [4500, 3000, 3000]], ['ceil', [2500, 4000, 4000]], ['nearest', [2500, 4000, 4000]]]) {
    const options = { ...defaults, roundingUnit: 1000, roundingMode, remainderRecipient: 'payer' };
    assert.deepEqual(allocateAmount(10500, [1, 1, 1], options, 0), expected);
    assert.equal(roundAmount(3500, options), roundingMode === 'floor' ? 3000 : 4000);
    assert.equal(roundAmount(3499, options), roundingMode === 'ceil' ? 4000 : 3000);
    assert.deepEqual(allocateAmount(1, [1, 1, 0], options, 0), roundingMode === 'ceil' ? [0, 1, 0] : [1, 0, 0]);
  }
  assert.equal(decodeOptions({ roundingMode: 'unknown' }), null);
  assert.equal(decodeOptions({ roundingMode: null }), null);
  assert.throws(() => allocateAmount(100, [1], { ...defaults, roundingMode: 'unknown' }));
  for (const unit of [1, 100, 500, 1000]) {
    for (const roundingMode of ['floor', 'ceil', 'nearest']) {
    for (const mode of ['payer', 'fraction']) {
      for (let total = 0; total < 5000; total += 37) {
        const weights = [1, 0, 0.5, 2];
        const allocation = allocateAmount(total, weights, { roundingUnit: unit, roundingMode, remainderRecipient: mode }, 2);
        assert.equal(sum(allocation), total);
        assert.equal(allocation[1], 0);
        assert.ok(allocation.every(amount => Number.isSafeInteger(amount) && amount >= 0));
        assert.ok(allocation.filter(amount => amount % unit !== 0).length <= 1);
      }
    }
    }
  }
  for (const roundingMode of ['floor', 'ceil', 'nearest']) {
    for (const weights of [[1], [1, 1, 1], Array(300).fill(1), [0, 1, 0.5, 2]]) {
      const amounts = allocateAmount(Number.MAX_SAFE_INTEGER, weights, { ...defaults, roundingUnit: 1000, roundingMode });
      assert.equal(sum(amounts), Number.MAX_SAFE_INTEGER);
      assert.ok(amounts.every(amount => Number.isSafeInteger(amount) && amount >= 0));
    }
  }

  const participants = [member('A'), member('B', 0.5), member('C'), member('D', 1, true)];
  const dishes = [item('宿代', 900, ['A', 'B'], 'C'), item('交通費', 401, ['A', 'C'], 'A')];
  const result = calculatePayments(dishes, participants, { ...defaults, taxRate: '10', serviceRate: '5', discount: '100' });
  assert.equal(result.totalAmount, 1396);
  assert.equal(sum(result.participants.map(p => p.totalOwed)), result.totalAmount);
  assert.equal(sum(result.participants.map(p => p.totalPaid)), result.totalAmount);
  assert.equal(result.participants[3].totalOwed, 0);
  assert.equal(result.participants[2].dishes.some(dish => dish.dishId === '宿代'), false);
  const before = structuredClone(result);
  const transfers = calculateTransfers(result);
  assert.deepEqual(result, before);
  const remaining = new Map(result.participants.map(p => [p.participantName, p.netAmount]));
  transfers.forEach(transfer => {
    assert.ok(Number.isInteger(transfer.amount) && transfer.amount > 0);
    remaining.set(transfer.from, remaining.get(transfer.from) + transfer.amount);
    remaining.set(transfer.to, remaining.get(transfer.to) - transfer.amount);
  });
  assert.ok([...remaining.values()].every(amount => amount === 0));
  assert.deepEqual(calculateTransfers(calculatePayments([item('料理', 1001, ['A', 'C'])], participants)), []);

  const people = [payment('A', 700), payment('B', 301)];
  const all = equalMembers(people, 3, []);
  const newEqual = calculateEqualSettlement(people, 3, all, defaults, false, colors);
  const newMeal = calculatePayments([item('会計', 1001, all.map(p => p.id), 'A')], all);
  const simple = calculateSimpleResult({ totalAmount: '1001', peopleCount: '3', options: defaults });
  assert.deepEqual(newEqual.charges.map(p => p.owedAmount), newMeal.participants.map(p => p.totalOwed));
  assert.deepEqual(newEqual.charges.map(p => p.owedAmount), allocateAmount(simple.total, [1, 1, 1]));
  assert.equal(simple.baseAmount, 333);
  assert.equal(simple.remainder, 2);
  const thousandOptions = { ...defaults, roundingUnit: 1000, remainderRecipient: 'payer' };
  assert.deepEqual(calculateSimpleResult({ totalAmount: '10001', peopleCount: '3', options: thousandOptions }).groups, [[4001, 1], [3000, 2]]);
  assert.equal(decodeMealShareData({ version: 2, participants, dishes, options: thousandOptions }).options.roundingUnit, 1000);
  assert.deepEqual(decodeSimpleData({ totalAmount: '1001', peopleCount: '3' }).options, defaults);
  assert.equal(decodeSimpleData({ totalAmount: '-100', peopleCount: '3' }), null);
  assert.equal(decodeSimpleData({ totalAmount: '100', peopleCount: '2.5' }), null);
  const weighted = all.map((p, index) => ({ ...p, burdenRate: index === 1 ? 0.5 : 1, displayOnly: index === 2 }));
  const weightedEqual = calculateEqualSettlement(people, 3, weighted, { roundingUnit: 500, remainderRecipient: 'payer' }, false, colors);
  assert.equal(sum(weightedEqual.charges.map(p => p.owedAmount)), 1001);
  assert.equal(weightedEqual.charges[2].owedAmount, 0);

  const oldMeal = { participants: [{ id: 'A', name: 'A' }, { id: 'B', name: 'B' }, { id: 'C', name: 'C' }], dishes: [{ id: 'food', name: '料理', price: '1001', eaters: ['A', 'B', 'C'] }] };
  const restoredMeal = decodeMealShareData(oldMeal);
  assert.equal(restoredMeal.legacy, true);
  assert.equal(restoredMeal.dishes[0].paidBy, '');
  const oldResult = calculatePayments(restoredMeal.dishes, restoredMeal.participants, restoredMeal.options, restoredMeal.legacy);
  assert.equal(oldResult.participants[0].totalOwed, 1001 / 3);
  assert.equal(oldResult.participants[0].totalPaid, 0);
  assert.deepEqual(calculateTransfers(oldResult), []);
  const restoredNewMeal = decodeMealShareData(JSON.parse(JSON.stringify({ version: 2, participants, dishes, options: { ...defaults, roundingUnit: 100 } })));
  assert.equal(restoredNewMeal.legacy, false);
  assert.deepEqual(calculatePayments(dishes, participants, restoredNewMeal.options), calculatePayments(restoredNewMeal.dishes, restoredNewMeal.participants, restoredNewMeal.options));
  assert.equal(decodeMealShareData({ ...oldMeal, dishes: [{ ...oldMeal.dishes[0], eaters: ['missing'] }] }), null);
  assert.equal(decodeMealShareData({ ...oldMeal, participants: [{ id: 'A', name: 'A', burdenRate: '1' }] }), null);
  assert.equal(decodeMealShareData({ ...oldMeal, participants: [...oldMeal.participants, oldMeal.participants[0]] }), null);
  assert.equal(decodeMealShareData({ ...oldMeal, options: { roundingUnit: 2 } }), null);
  const modernMeal = { version: 2, ...oldMeal, options: defaults };
  for (const invalidDish of [item('zero', 0, ['A']), { ...item('blank', 100, ['A']), name: ' ' }]) {
    assert.equal(decodeMealShareData({ ...modernMeal, dishes: [invalidDish] }), null);
  }
  assert.equal(decodeMealShareData({ ...modernMeal, participants: [member('A'), { ...member('B'), name: ' ' }] }), null);
  assert.ok(decodeMealShareData({ ...oldMeal, dishes: [item('zero', 0, ['A'])] }));
  const overflowDishes = [item('large', Number.MAX_SAFE_INTEGER, ['A']), item('extra', 1, ['A'])];
  assert.equal(decodeMealShareData({ ...modernMeal, dishes: overflowDishes }), null);
  assert.equal(decodeMealShareData({ ...modernMeal, dishes: [item('large', 100000000000000, ['A'])], options: { ...defaults, taxRate: '10000', serviceRate: '10000' } }), null);
  assert.ok(Number.isNaN(adjustedAmount(sum(overflowDishes.map(dish => parseAmount(dish.price))), defaults)));

  const equalTargets = [member('A'), member('B'), member('C')];
  for (const unit of [1, 100, 500, 1000]) {
    for (const roundingMode of ['floor', 'ceil', 'nearest']) {
      for (const remainderRecipient of ['fraction', 'payer']) {
        const options = { ...defaults, roundingUnit: unit, roundingMode, remainderRecipient };
        const merged = calculatePayments([item('combined', 3000, ['A', 'B', 'C'], 'A')], equalTargets, options);
        const split = calculatePayments([1, 2, 3].map(id => item(String(id), 1000, ['A', 'B', 'C'], 'A')), equalTargets, options);
        assert.deepEqual(split.participants.map(p => p.totalOwed), [1000, 1000, 1000]);
        assert.deepEqual(split.participants.map(p => p.totalOwed), merged.participants.map(p => p.totalOwed));
        assert.deepEqual(calculateTransfers(split).map(t => t.amount), [1000, 1000]);
        const weightedTargets = [member('A'), member('B', 0.5), member('C', 1, true)];
        const weightedMerged = calculatePayments([item('combined', 3003, ['A', 'B', 'C'], 'B')], weightedTargets, options);
        const weightedSplit = calculatePayments([1, 2, 3].map(id => item(String(id), 1001, ['A', 'B', 'C'], 'B')), weightedTargets, options);
        assert.deepEqual(weightedSplit.participants.map(p => p.totalOwed), weightedMerged.participants.map(p => p.totalOwed));
        assert.equal(weightedSplit.participants[2].totalOwed, 0);
        assert.equal(sum(weightedSplit.participants.map(p => p.totalOwed)), 3003);
        assert.ok(weightedSplit.participants.every(p => Number.isSafeInteger(p.totalOwed) && p.totalOwed >= 0));
      }
    }
  }
  const excludedPayer = calculatePayments([item('A only', 1001, ['A'], 'C')], equalTargets, thousandOptions);
  assert.deepEqual(excludedPayer.participants.map(p => p.totalOwed), [1001, 0, 0]);
  for (let seed = 1; seed <= 500; seed += 1) {
    const members = [member('A'), member('B', (seed % 7 + 1) / 4), member('C'), member('D', 1, true)];
    const items = [item('AB', seed * 13, ['A', 'B', 'D'], 'C'), item('BC', seed * 7 + 1, ['B', 'C'], 'A'), item('A', 101, ['A'], 'B')];
    const options = { ...defaults, roundingUnit: [1, 100, 500, 1000][seed % 4], roundingMode: ['floor', 'ceil', 'nearest'][seed % 3], remainderRecipient: seed % 2 ? 'payer' : 'fraction', taxRate: '10', discount: '100' };
    const result = calculatePayments(items, members, options);
    assert.equal(sum(result.participants.map(p => p.totalOwed)), result.totalAmount);
    assert.equal(sum(result.participants.map(p => p.totalPaid)), result.totalAmount);
    assert.equal(result.participants[3].totalOwed, 0);
    assert.ok(result.participants.every(p => Number.isSafeInteger(p.totalOwed) && p.totalOwed >= 0));
    const balances = new Map(result.participants.map(p => [p.participantName, p.netAmount]));
    for (const transfer of calculateTransfers(result)) {
      balances.set(transfer.from, balances.get(transfer.from) + transfer.amount);
      balances.set(transfer.to, balances.get(transfer.to) - transfer.amount);
    }
    assert.ok([...balances.values()].every(balance => balance === 0));
  }
  const recoveryMarkup = renderToStaticMarkup(createElement(ParticipantInputStep, { initialParticipants: [member('B', 0)], onComplete() {} }));
  assert.match(recoveryMarkup, /type="number"/);
  assert.match(recoveryMarkup, /負担する人がいなくなりました/);
  const normalMarkup = renderToStaticMarkup(createElement(ParticipantInputStep, { initialParticipants: [member('B')], onComplete() {} }));
  assert.doesNotMatch(normalMarkup, /type="number"/);
  const transferMarkup = renderToStaticMarkup(createElement(SettlementRouteList, { transfers: [{ from: 'B', to: 'A', amount: 4000, textColor: 'blue' }, { from: 'D', to: 'A', amount: 4000, textColor: 'blue' }] }));
  assert.doesNotMatch(transferMarkup, /〜/);
  assert.equal((transferMarkup.match(/4,000円/g) ?? []).length, 2);

  const adjustmentDishes = [item('料理', 900, ['A', 'B', 'C'], 'A'), item('交通費', 401, ['A'], 'B')];
  const adjustmentDraft = { version: 2, participants: [member('A'), member('B', 0.5), member('C', 1, true)], dishes: adjustmentDishes, options: defaults };
  const adjustedMeal = decodeMealShareData(adjustmentDraft);
  assert.ok(adjustedMeal);
  assert.deepEqual(adjustedMeal.dishes[0].eaters, ['A', 'B', 'C']);
  assert.deepEqual(calculatePayments(adjustedMeal.dishes, adjustedMeal.participants, adjustedMeal.options).participants.map(p => p.totalOwed), [1001, 300, 0]);
  assert.equal(decodeMealShareData({ ...adjustmentDraft, participants: [member('A', 0), member('B', 0.5), member('C', 1, true)] }), null);
  assert.equal(decodeMealShareData({ ...adjustmentDraft, participants: [member('A', 1, true), member('B'), member('C')] }), null);
  assert.equal(decodeMealShareData({ ...adjustmentDraft, options: { ...defaults, taxRate: '-1' } }), null);
  const restoredTargets = decodeMealShareData({ ...adjustmentDraft, participants: [member('A'), member('B'), member('C')] });
  assert.deepEqual(calculatePayments(restoredTargets.dishes, restoredTargets.participants, restoredTargets.options).participants.map(p => p.totalOwed), [701, 300, 300]);
  const simpleDraft = { totalAmount: '10000', peopleCount: '3', options: { ...defaults, taxRate: '10', serviceRate: '5', discount: '1000', roundingUnit: 1000, roundingMode: 'ceil', remainderRecipient: 'payer' } };
  const restoredSimpleDraft = decodeSimpleData(JSON.parse(JSON.stringify({ version: 2, ...simpleDraft })));
  assert.deepEqual(restoredSimpleDraft, simpleDraft);
  assert.deepEqual(calculateSimpleResult(restoredSimpleDraft).groups, [[2500, 1], [4000, 2]]);
  assert.equal(calculateSimpleResult({ ...simpleDraft, options: { ...simpleDraft.options, taxRate: '-1' } }).isValid, false);

  const oldEqual = { people: [{ name: 'A', payments: [{ amount: 1001 }] }], nonPayingParticipants: 2 };
  const restoredEqual = decodeEqualShareData(oldEqual);
  assert.equal(restoredEqual.legacy, true);
  const legacyEqual = calculateEqualSettlement(restoredEqual.people, restoredEqual.totalParticipants, restoredEqual.members, restoredEqual.rounding, restoredEqual.legacy, colors);
  assert.deepEqual(legacyEqual.charges.map(p => p.owedAmount), [334, 334, 334]);
  assert.deepEqual(legacyEqual.transfers.map(t => t.amount), [334, 333]);
  const newEqualLink = { version: 2, people, totalParticipants: 3, members: weighted, rounding: { roundingUnit: 500, remainderRecipient: 'payer' } };
  const restoredNewEqual = decodeEqualShareData(JSON.parse(JSON.stringify(newEqualLink)));
  assert.equal(restoredNewEqual.legacy, false);
  assert.equal(decodeEqualShareData({ ...newEqualLink, rounding: thousandOptions }).rounding.roundingUnit, 1000);
  for (const roundingMode of ['floor', 'ceil', 'nearest']) {
    const options = { ...thousandOptions, roundingMode };
    const shared = decodeEqualShareData({ ...newEqualLink, rounding: options });
    assert.equal(shared.rounding.roundingMode, roundingMode);
    const equal = calculateEqualSettlement(people, 3, all, options, false, colors);
    const meal = calculatePayments([item('会計', 1001, all.map(p => p.id), 'A')], all, options);
    const restoredMeal = decodeMealShareData({ version: 2, participants: all, dishes: [item('会計', 1001, all.map(p => p.id), 'A')], options });
    assert.equal(restoredMeal.options.roundingMode, roundingMode);
    assert.deepEqual(equal.charges.map(p => p.owedAmount), meal.participants.map(p => p.totalOwed));
    const restoredSimple = decodeSimpleData({ version: 2, totalAmount: '1001', peopleCount: '3', options });
    assert.equal(restoredSimple.options.roundingMode, roundingMode);
    const expectedGroups = new Map();
    equal.charges.forEach(member => expectedGroups.set(member.owedAmount, (expectedGroups.get(member.owedAmount) ?? 0) + 1));
    assert.deepEqual(calculateSimpleResult(restoredSimple).groups, [...expectedGroups]);
  }
  assert.deepEqual(calculateEqualSettlement(restoredNewEqual.people, 3, restoredNewEqual.members, restoredNewEqual.rounding, false, colors).charges, weightedEqual.charges);
  assert.equal(decodeEqualShareData({ ...oldEqual, totalParticipants: 1e10 }), null);
  assert.equal(decodeEqualShareData({ ...oldEqual, people: [{ name: 'A', payments: [{ amount: -1 }] }] }), null);
  assert.equal(decodeEqualShareData({ ...newEqualLink, members: weighted.map(p => ({ ...p, burdenRate: 0 })) }), null);
  const balances = [{ id: 'A', balance: 100 }, { id: 'B', balance: -100 }];
  assert.deepEqual(settleBalances(balances), [{ from: 'B', to: 'A', amount: 100 }]);
  assert.deepEqual(balances, [{ id: 'A', balance: 100 }, { id: 'B', balance: -100 }]);
  console.log('配分・端数・精算・旧/新共有データ: 検証OK');
} finally {
  await server.close();
}
