export default function SkillTag({ skill, onRemove, removable = false }) {
  return (
    <div className="flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
      {skill}
      {removable && (
        <button 
          onClick={() => onRemove(skill)}
          className="ml-1 text-indigo-500 hover:text-indigo-700"
        >
          ×
        </button>
      )}
    </div>
  );
}