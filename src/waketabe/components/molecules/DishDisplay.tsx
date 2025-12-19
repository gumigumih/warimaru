import type { Dish, Participant } from '../../domain/entities';

export const DishDisplay = ({ dish, participants }: { dish: Dish; participants: Participant[] }) => {
  const eaterNames = dish.eaters
    .map(id => participants.find(p => p.id === id)?.name)
    .filter(Boolean)
    .join('、');

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800">{dish.name}</span>
        <span className="font-bold text-gray-900">{dish.price}円</span>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        食べた人: {eaterNames || '未選択'}
      </div>
    </div>
  );
};

