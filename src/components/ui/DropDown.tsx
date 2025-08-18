import React, { useState } from 'react';

interface DropDownProps {
  options: { language: string; abbr: string }[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({ options, selectedOption, onSelectOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onSelectOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
        transition-colors duration-200 cursor-pointer"
      >
        {selectedOption}
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-center
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md rounded-md"
        >
          {options.map((option) => (
            <div
              key={option.abbr}
              onClick={() => handleOptionClick(option.abbr)}
              className="py-2 px-4 hover:bg-background hover:text-primary cursor-pointer"
            >
              {option.language}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
