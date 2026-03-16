function TrackerList({ trackers, activeTracker, onSelectTracker }) {
  if (!trackers.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-zinc-400">No trackers found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {trackers.map((tracker) => {
        const isActive = activeTracker?._id === tracker._id;

        return (
          <button
            key={tracker._id}
            type="button"
            onClick={() => onSelectTracker(tracker)}
            className={`rounded-2xl border p-5 text-left transition ${
              isActive
                ? "border-violet-500 bg-violet-500/10"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-lg font-semibold text-white">{tracker.name}</h3>
              {tracker.isDefault && (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                  Default
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-400">
              {tracker.description || "No description"}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default TrackerList;