import { useState } from "react";

export function PlaylistStatusToggle({
  playlistId,
  initialActive,
}: {
  playlistId: number;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`Toggle playlist ${playlistId} status`}
      onClick={() => setActive((current) => !current)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        active ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-background shadow transition-transform ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
      <span className="sr-only">{active ? "Active" : "Inactive"}</span>
    </button>
  );
}
