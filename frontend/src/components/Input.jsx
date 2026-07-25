// A labeled text input with an optional inline error message.
// Centralizing this means every form field gets the same spacing,
// border color, and error styling automatically.
const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 rounded-lg bg-bg-secondary border text-text-primary
          placeholder:text-text-muted outline-none transition-colors
          ${error ? "border-error" : "border-slate-700 focus:border-primary"}
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Input;
