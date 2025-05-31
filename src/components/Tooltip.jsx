// src/components/Tooltip.jsx
export default function Tooltip({ text, children }) {
  return (
    <div className="relative group inline-flex justify-center">
      {children}
      <span className="absolute -top-3 bg-gray-600 text-gray-200 text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {text}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rotate-45 -mb-1"></span>
      </span>
    </div>
  );
}
