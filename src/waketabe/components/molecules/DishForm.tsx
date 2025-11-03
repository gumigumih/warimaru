import { TextInput } from '../atoms/TextInput';
import { Checkbox } from '../atoms/Checkbox';
import { AmountInput } from '../atoms/AmountInput';
import type { Participant } from '../../domain/entities';

interface DishFormProps {
  dishName: string;
  dishPrice: string;
  selectedEaters: string[];
  participants: Participant[];
  onDishNameChange: (value: string) => void;
  onDishPriceChange: (value: string) => void;
  onEatersChange: (eaterIds: string[]) => void;
  className?: string;
}

export const DishForm = ({
  dishName,
  dishPrice,
  selectedEaters,
  participants,
  onDishNameChange,
  onDishPriceChange,
  onEatersChange,
  className = '',
}: DishFormProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2 w-full">
        <TextInput
          type="text"
          className="flex-1"
          placeholder="料理名"
          value={dishName}
          onChange={e => onDishNameChange(e.target.value)}
        />
        <AmountInput
          value={dishPrice}
          onChange={onDishPriceChange}
          title={dishName ? `${dishName}の金額を入力` : '料理の金額を入力'}
          className="w-32 cursor-pointer bg-white rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          placeholder="金額"
        />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">食べた人：</div>
        <div className="flex flex-wrap gap-4">
          {participants.map(p => (
            <Checkbox
              key={p.id}
              checked={selectedEaters.includes(p.id)}
              onChange={e => {
                if (e.target.checked) {
                  onEatersChange([...selectedEaters, p.id]);
                } else {
                  onEatersChange(selectedEaters.filter(id => id !== p.id));
                }
              }}
            >
              {p.name}
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  );
};

