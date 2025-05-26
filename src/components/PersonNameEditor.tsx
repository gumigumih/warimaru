import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { AppDispatch } from '../store/store';
import { updatePersonName } from '../store/peopleSlice';

interface PersonNameEditorProps {
  personId: string;
  name: string;
  dispatch: AppDispatch;
  onDeletePerson: (personId: string) => void;
}

export const PersonNameEditor = ({ personId, name, dispatch, onDeletePerson }: PersonNameEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editedName.replace(/さん$/, '')}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              const newName = editedName.endsWith('さん') ? editedName : `${editedName}さん`;
              dispatch(updatePersonName({ personId, newName }));
              setIsEditing(false);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setIsEditing(false);
              setEditedName(name);
            }
          }}
          className="text-lg font-medium text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={() => {
            const newName = editedName.endsWith('さん') ? editedName : `${editedName}さん`;
            dispatch(updatePersonName({ personId, newName }));
            setIsEditing(false);
          }}
          className="text-blue-600 hover:text-blue-700"
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button
          onClick={() => {
            setIsEditing(false);
            setEditedName(name);
          }}
          className="text-gray-600 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <button
        onClick={() => setIsEditing(true)}
        className="text-gray-400 hover:text-gray-500"
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button
        onClick={() => onDeletePerson(personId)}
        className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
        title="人物を削除"
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
}; 