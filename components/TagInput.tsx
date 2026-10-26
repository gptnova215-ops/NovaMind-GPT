
import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
        <div className="flex flex-wrap gap-2 items-center w-full bg-gray-800/50 rounded-lg px-2 py-2 border border-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500">
        {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-1 bg-indigo-500/50 text-indigo-100 text-sm font-medium px-2 py-1 rounded">
            <span>{tag}</span>
            <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-indigo-200 hover:text-white"
                aria-label={`Remove ${tag}`}
            >
                &times;
            </button>
            </div>
        ))}
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none p-1 min-w-[120px]"
        />
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add an item.</p>
    </div>
    
  );
};
