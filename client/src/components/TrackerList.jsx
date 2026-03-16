import {
  Wallet,
  Home,
  Briefcase,
  Plane,
  ShoppingCart,
  Heart,
} from "lucide-react";

function TrackerList({ trackers, activeTracker, onSelectTracker }) {
  const iconMap = {
    wallet: Wallet,
    home: Home,
    briefcase: Briefcase,
    plane: Plane,
    "shopping-cart": ShoppingCart,
    heart: Heart,
  };

  const colorMap = {
    violet:
      "border-violet-300 bg-violet-50 dark:border-violet-500/40 dark:bg-violet-500/10",
    blue:
      "border-blue-300 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10",
    emerald:
      "border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
    rose:
      "border-rose-300 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10",
    amber:
      "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
  };

  if (!trackers.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">No trackers found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {trackers.map((tracker) => {
        const isActive = activeTracker?._id === tracker._id;
        const Icon = iconMap[tracker.icon] || Wallet;
        const colorClass =
          colorMap[tracker.color] ||
          "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";

        return (
          <button
            key={tracker._id}
            type="button"
            onClick={() => onSelectTracker(tracker)}
            className={`rounded-2xl border p-5 text-left transition ${
              isActive
                ? colorClass
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800">
                  <Icon
                    size={18}
                    className="text-zinc-900 dark:text-white"
                  />
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {tracker.name}
                </h3>
              </div>

              {tracker.isDefault && (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  Default
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {tracker.description || "No description"}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default TrackerList;