import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../atoms/Button';
import { DishRow } from '../molecules/DishRow';
import { DishForm } from '../molecules/DishForm';
import type { Participant, Dish } from '../../domain/entities';

export const DishInput = ({ participants, onComplete, onBack, initialDishes = [] }: { 
  participants: Participant[]; 
  onComplete?: (dishes: Dish[]) => void;
  onBack?: () => void;
  initialDishes?: Dish[];
}) => {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [selectedEaters, setSelectedEaters] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<{ name: string; price: string; eaters: string[] }>({ name: '', price: '', eaters: [] });
  const [error, setError] = useState<string>('');

  const resetInput = () => {
    setDishName('');
    setDishPrice('');
    setSelectedEaters([]);
    setError('');
  };

  const handleAdd = () => {
    setError('');
    if (!dishName.trim()) { setError('料理名を入力してください'); return; }
    if (!dishPrice.trim()) { setError('金額を入力してください'); return; }
    if (selectedEaters.length === 0) { setError('食べた人を選択してください'); return; }
    const price = parseFloat(dishPrice.replace(/[^\d.-]/g, ''));
    if (isNaN(price) || price <= 0) { setError('有効な金額を入力してください'); return; }
    setDishes([...dishes, { id: crypto.randomUUID(), name: dishName.trim(), price: dishPrice.trim(), eaters: [...selectedEaters] }]);
    resetInput();
  };

  const handleDelete = (id: string) => {
    setDishes(dishes.filter(d => d.id !== id));
  };

  const handleEdit = (dish: Dish) => {
    setEditingId(dish.id);
    setEditingDish({ name: dish.name, price: dish.price, eaters: [...dish.eaters] });
  };

  const handleEditChange = (field: 'name' | 'price' | 'eaters', value: string | string[]) => {
    setEditingDish(ed => ({ ...ed, [field]: value }));
  };

  const handleEditSave = (id: string) => {
    setDishes(dishes.map(d => d.id === id ? { ...d, ...editingDish } : d));
    setEditingId(null);
    setEditingDish({ name: '', price: '', eaters: [] });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingDish({ name: '', price: '', eaters: [] });
  };

  return (
    <>
      {onBack && (
        <div className="flex justify-start mb-4">
          <button
            onClick={onBack}
            className="btn btn-neutral"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            戻る
          </button>
        </div>
      )}
      <div className="max-w-xl mx-auto glass-card p-6 mt-4">
        <div className="text-center text-lg font-semibold text-gray-800 mb-4">
          料理名・金額・食べた人を入力してください
        </div>
        <form
          className="flex flex-col gap-2 mb-4"
          onSubmit={e => { e.preventDefault(); handleAdd(); }}
        >
          <DishForm
            dishName={dishName}
            dishPrice={dishPrice}
            selectedEaters={selectedEaters}
            participants={participants}
            onDishNameChange={setDishName}
            onDishPriceChange={setDishPrice}
            onEatersChange={setSelectedEaters}
          />
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}
          <Button type="submit" className="w-full">追加</Button>
        </form>
        {dishes.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">追加された料理</h3>
            {dishes.map(d => (
              <DishRow
                key={d.id}
                dish={d}
                participants={participants}
                isEditing={editingId === d.id}
                editingDish={editingDish}
                onEdit={() => handleEdit(d)}
                onDelete={() => handleDelete(d.id)}
                onEditChange={handleEditChange}
                onEditSave={() => handleEditSave(d.id)}
                onEditCancel={handleEditCancel}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🍽️</div>
            <p>まだ料理が追加されていません</p>
            <p className="text-sm">上記のフォームから料理を追加してください</p>
          </div>
        )}
      </div>
      {onComplete && (
        <button
          className="btn btn-primary mt-6 w-full text-lg"
          onClick={() => onComplete(dishes)}
          disabled={dishes.length === 0}
        >
          次へ
        </button>
      )}
    </>
  );
};

