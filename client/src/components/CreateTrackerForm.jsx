import { useState } from "react";

function CreateTrackerForm({ onCreateTracker, loading }) {
  const [formData, setFormData] = useState({
  name: "",
  description: "",
  color: "violet",
  icon: "wallet",
});

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Tracker name is required");
      return;
    }

    const success = await onCreateTracker(formData);

    if (success) {
      setFormData({
        name: "",
        description: "",
        color: "violet",
      });
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold  mb-4">Create Tracker</h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm ">Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Office"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm ">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Short description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm ">Color</label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="violet">Violet</option>
            <option value="blue">Blue</option>
            <option value="emerald">Emerald</option>
            <option value="rose">Rose</option>
            <option value="amber">Amber</option>
          </select>
        </div>

        <div>
  <label className="block mb-2 text-sm ">Icon</label>
  <select
    name="icon"
    value={formData.icon}
    onChange={handleChange}
    className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
  >
    <option value="wallet">Wallet</option>
    <option value="home">Home</option>
    <option value="briefcase">Briefcase</option>
    <option value="plane">Plane</option>
    <option value="shopping-cart">Shopping Cart</option>
    <option value="heart">Heart</option>
  </select>
</div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "Creating tracker..." : "Create Tracker"}
        </button>
      </form>
    </div>
  );
}

export default CreateTrackerForm;