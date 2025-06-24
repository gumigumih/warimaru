import type { KeyboardEvent } from 'react';

interface InputRow {
  id: string;
  amount: string;
  description: string;
}

interface SavePaymentFunction {
  (personId: string, paymentId: string, amount: number | string, description?: string): void;
}

export const handleDetailKeyDown = (
  index: number,
  field: 'amount' | 'description',
  e: KeyboardEvent<HTMLInputElement>,
  inputRows: InputRow[],
  savePayment: SavePaymentFunction,
  personId: string
) => {
  const currentRow = inputRows[index];

  // 保存処理
  const amount = Number(currentRow.amount.replace(/,/g, '')) || 0;
  savePayment(personId, currentRow.id, amount, currentRow.description);

  // フォーカスを移動する関数
  const moveFocus = (direction: 'left' | 'right') => {
    const currentInput = e.currentTarget;
    const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]')) as HTMLInputElement[];
    const currentIndex = allInputs.indexOf(currentInput);
    const targetIndex = currentIndex + (direction === 'right' ? 1 : -1);

    if (targetIndex >= 0 && targetIndex < allInputs.length) {
      allInputs[targetIndex].focus();
    }
  };

  // 上下のフォーカスを移動する関数
  const moveFocusVertical = (direction: 'up' | 'down') => {
    const currentInput = e.currentTarget;
    const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]')) as HTMLInputElement[];
    const currentIndex = allInputs.indexOf(currentInput);
    const targetIndex = currentIndex + (direction === 'down' ? 2 : -2); // 2は1行あたりの入力フィールド数

    if (targetIndex >= 0 && targetIndex < allInputs.length) {
      allInputs[targetIndex].focus();
    }
  };

  // フィールドに応じたフォーカス移動
  if (e.key === 'Enter') {
    e.preventDefault();
    if (field === 'amount') {
      moveFocus('right');
    } else {
      moveFocusVertical('down');
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (field === 'amount') {
      moveFocus('right');
    }
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (field === 'description') {
      moveFocus('left');
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    moveFocusVertical('down');
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    moveFocusVertical('up');
  }
};

export const handleSimpleKeyDown = (
  e: KeyboardEvent<HTMLInputElement>,
  savePayment: SavePaymentFunction,
  personId: string
) => {
  // シンプルモード用のフォーカス移動関数
  const moveFocusSimple = (direction: 'up' | 'down') => {
    const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]')) as HTMLInputElement[];
    const currentIndex = allInputs.indexOf(e.currentTarget);
    const targetIndex = currentIndex + (direction === 'down' ? 1 : -1);

    if (targetIndex >= 0 && targetIndex < allInputs.length) {
      allInputs[targetIndex].focus();
    }
  };

  // 保存処理
  const amount = Number(e.currentTarget.value.replace(/,/g, '')) || 0;
  savePayment(personId, '', amount, '');

  if (e.key === 'Enter') {
    e.preventDefault();
    moveFocusSimple('down');
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    moveFocusSimple('down');
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    moveFocusSimple('up');
  }
}; 