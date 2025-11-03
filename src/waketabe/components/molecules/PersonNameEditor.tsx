import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { TextInput } from '../atoms/TextInput';

interface PersonNameEditorProps {
  personId: string;
  name: string;
  onUpdateName?: (personId: string, newName: string) => void;
  onDeletePerson: (personId: string) => void;
}

export const PersonNameEditor = ({ personId, name, onUpdateName, onDeletePerson }: PersonNameEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  if (isEditing) {
    return (
      <div className="flex w-full items-center gap-2">
        <TextInput
          type="text"
          value={editedName.replace(/さん$/, '')}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              const newName = editedName.endsWith('さん') ? editedName : `${editedName}さん`;
              if (onUpdateName) { onUpdateName(personId, newName); }
              setIsEditing(false);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setIsEditing(false);
              setEditedName(name);
            }
          }}
          className="flex-1 text-lg font-medium text-gray-900"
          autoFocus
        />
        <button
          onClick={() => {
            const newName = editedName.endsWith('さん') ? editedName : `${editedName}さん`;
            if (onUpdateName) { onUpdateName(personId, newName); }
            setIsEditing(false);
          }}
          className="text-blue-600 hover:text-blue-700 p-2"
          title="保存"
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button
          onClick={() => {
            setIsEditing(false);
            setEditedName(name);
          }}
          className="text-gray-600 hover:text-gray-700 p-2"
          title="キャンセル"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <h3 className="flex-1 text-lg font-bold text-gray-900">{name}</h3>
      <button
        onClick={() => setIsEditing(true)}
        className="text-gray-400 hover:text-gray-500 p-2"
        title="編集"
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button
        onClick={() => {
          if (window.confirm('この参加者を削除してもよろしいですか？')) {
            onDeletePerson(personId);
          }
        }}
        className="ml-auto text-gray-400 hover:text-red-500 transition-colors p-2"
        title="人物を削除"
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
};

