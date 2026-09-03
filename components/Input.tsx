import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type?: string;
}

export default function Input({ label, name, type = 'text', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700 block">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition text-sm text-slate-800 placeholder:text-slate-400 bg-white"
        {...props}
      />
    </div>
  );
}