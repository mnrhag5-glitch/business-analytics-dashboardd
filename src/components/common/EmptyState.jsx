
import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing to show yet",
  description = "There are no records matching your current filters.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={26} strokeWidth={1.6} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      {action && (
        <button
          type="button"
          className="button button--secondary"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
