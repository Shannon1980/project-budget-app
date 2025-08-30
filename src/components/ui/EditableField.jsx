import React, { useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';

const EditableField = ({ 
  value, 
  onSave, 
  type = 'text', 
  placeholder = '', 
  className = '',
  darkMode 
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    if (onSave) {
      onSave(tempValue);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!onSave) {
    return (
      <span className={`text-gray-900 dark:text-white ${className}`}>
        {type === 'currency' ? `$${value.toLocaleString()}` : value}
      </span>
    );
  }

  if (editing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
        >
          <Save className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-gray-900 dark:text-white ${className}`}>
        {type === 'currency' ? `$${value.toLocaleString()}` : value}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <Edit3 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EditableField;
