
import { useState } from "react";

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700 ring-indigo-200",
  "bg-teal-100 text-teal-700 ring-teal-200",
  "bg-violet-100 text-violet-700 ring-violet-200",
  "bg-blue-100 text-blue-700 ring-blue-200",
  "bg-rose-100 text-rose-700 ring-rose-200",
];

const AVATAR_SIZES = {
  small: "h-7 w-7 text-[10px]",
  medium: "h-9 w-9 text-xs",
  large: "h-11 w-11 text-sm",
  xlarge: "h-14 w-14 text-base",
};

export default function Avatar({
  name = "Unknown User",
  initials,
  src,
  size = "medium",
  showName = false,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const fallback =
    initials ||
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ||
    "?";

  const colorIndex =
    name
      .split("")
      .reduce(
        (total, character) => total + character.charCodeAt(0),
        0,
      ) % AVATAR_COLORS.length;

  const avatarSize = AVATAR_SIZES[size] ?? AVATAR_SIZES.medium;

  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold ring-1 ring-inset ${avatarSize} ${AVATAR_COLORS[colorIndex]}`}
        title={name}
        aria-label={name}
      >
        {src && !imageFailed ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{fallback}</span>
        )}
      </span>

      {showName && (
        <span className="truncate text-sm font-medium text-slate-700">
          {name}
        </span>
      )}
    </span>
  );
}
