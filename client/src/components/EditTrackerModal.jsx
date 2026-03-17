import { useEffect, useState } from "react";

function EditTrackerModal({ tracker, isOpen, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "violet",
    icon: "wallet",
  });

  useEffect(() => {
    if (tracker) {
      setFormData({
        name: tracker.name || "",
        description: tracker.description || "",
        color: tracker.color || "violet",
        icon: tracker.icon || "wallet",
      });
    }
  }, [tracker]);

  if (!isOpen || !tracker) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSave(tracker._id, formData);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Edit Tracker
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tracker name"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />

          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
          />

          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="violet">Violet</option>
            <option value="blue">Blue</option>
            <option value="emerald">Emerald</option>
            <option value="rose">Rose</option>
            <option value="amber">Amber</option>
          </select>

          <select
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="wallet">Wallet</option>
            <option value="home">Home</option>
            <option value="briefcase">Briefcase</option>
            <option value="plane">Plane</option>
            <option value="shopping-cart">Shopping Cart</option>
            <option value="heart">Heart</option>
          </select>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTrackerModal;