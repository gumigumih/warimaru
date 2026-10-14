import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DishForm } from './DishForm';
import { DishDisplay } from './DishDisplay';
import type { Participant, Dish } from '../../domain/entities';

interface DishRowProps {
  dish: Dish;
  participants: Participant[];
  isEditing: boolean;
  editingDish: { name: string; price: string; eaters: string[] };
  onEdit: () => void;
  onDelete: () => void;
  onEditChange: (field: 'name' | 'price' | 'eaters', value: string | string[]) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
}

export const DishRow = ({
  dish,
  participants,
  isEditing,
  editingDish,
  onEdit,
  onDelete,
  onEditChange,
  onEditSave,
  onEditCancel,
}: DishRowProps) => {
  if (isEditing) {
    return (
      <div className="bg-white/90 rounded-lg border-2 border-blue-300 shadow-md p-4 mb-3">
        <div className="space-y-4">
          <div className="w-full">
            <DishForm
              dishName={editingDish.name}
              dishPrice={editingDish.price}
              selectedEaters={editingDish.eaters}
              participants={participants}
              onDishNameChange={(value) => onEditChange('name', value)}
              onDishPriceChange={(value) => onEditChange('price', value)}
              onEatersChange={(eaterIds) => onEditChange('eaters', eaterIds)}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button onClick={onEditCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors" title="キャンセル">
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              キャンセル
            </button>
            <button onClick={onEditSave} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors" title="保存">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white/90 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <DishDisplay dish={dish} participants={participants} />
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={onEdit} className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="編集">
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm(`「${dish.name}」を削除してもよろしいですか？\n\nこの操作は取り消せません。`)) {
                onDelete();
              }
            }} 
            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors" 
            title="削除"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>
    </div>
  );
};

