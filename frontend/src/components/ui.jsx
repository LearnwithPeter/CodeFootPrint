// A simple bordered container - the base building block for almost every
// piece of the UI (stat cards, form panels, table wrappers, etc.)
export const Card = ({ children, className = "" }) => (
  <div className={`bg-bg-card border border-slate-800 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

// A small colored pill, used for statuses like "completed" or "failed".
const BADGE_STYLES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
  info: "bg-info/10 text-info",
  neutral: "bg-slate-700/50 text-text-secondary",
};

export const Badge = ({ children, variant = "neutral" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${BADGE_STYLES[variant]}`}
  >
    {children}
  </span>
);

// A simple spinning loader. Used any time we're waiting on the API.
// "size" controls the diameter in pixels - defaults to a small inline spinner.
export const Spinner = ({ size = 20, className = "" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-slate-700 border-t-primary ${className}`}
    style={{ width: size, height: size }}
  />
);

// Shown when a list has no data yet (e.g. "no analyses run yet") -
// treats emptiness as a moment to guide the user toward an action,
// not just a blank space.
export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <h3 className="text-text-primary font-semibold text-lg mb-1.5">{title}</h3>
    <p className="text-text-muted text-sm mb-5 max-w-sm">{description}</p>
    {action}
  </div>
);
