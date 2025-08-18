import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'input' | 'textarea';
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type = 'input' }) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={label}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
                     transition-colors duration-200 resize-none"
          placeholder={`Enter ${label.toLowerCase()}...`}
          autoComplete="off"
        />
      ) : (
        <input
          id={label}
          type="text"
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
                     transition-colors duration-200"
          placeholder={`Enter ${label.toLowerCase()}...`}
          autoComplete="off"
        />
      )}
    </div>
  );
};

export default Input;
