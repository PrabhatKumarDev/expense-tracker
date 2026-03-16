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
    violet: "border-violet-500/40 bg-violet-500/10",
    blue: "border-blue-500/40 bg-blue-500/10",
    emerald: "border-emerald-500/40 bg-emerald-500/10",
    rose: "border-rose-500/40 bg-rose-500/10",
    amber: "border-amber-500/40 bg-amber-500/10",
  };
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
        const Icon = iconMap[tracker.icon] || Wallet;
        const colorClass =
          colorMap[tracker.color] || "border-zinc-800 bg-zinc-900";

        return (
          <button
            key={tracker._id}
            type="button"
            onClick={() => onSelectTracker(tracker)}
            className={`rounded-2xl border p-5 text-left transition ${
              isActive
                ? colorClass
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="rounded-xl bg-zinc-800 p-2">
                <Icon size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {tracker.name}
              </h3>
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
