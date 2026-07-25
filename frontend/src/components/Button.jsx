// A single reusable Button. "variant" picks the visual style so every
// button in the app looks consistent instead of each page inventing its own.
const VARIANT_STYLES = {
  primary: "bg-primary text-white hover:bg-blue-600",
  secondary: "bg-bg-card text-text-primary hover:bg-slate-700 border border-slate-700",
  danger: "bg-error/10 text-error hover:bg-error/20 border border-error/30",
};

const Button = ({ children, variant = "primary", disabled, className = "", ...props }) => {
  return (
    <button
      disabled={disabled}
      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
