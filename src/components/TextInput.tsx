import React from "react";

interface TextInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  required = false,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${className}`}
      required={required}
    />
  );
};

export default TextInput;
