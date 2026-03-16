import { useState } from "react";

function CreateExpenseForm({ activeTracker, onCreateExpense, loading }) {
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    category: "",
    paymentMethod: "Cash",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [error, setError] = useState("");

  const categories = [
    "Food",
    "Travel",
    "Bills",
    "Shopping",
    "Entertainment",
    "Health",
    "Education",
    "Office",
    "Home",
    "Subscription",
    "Miscellaneous",
  ];

  const paymentMethods = ["Cash", "UPI", "Card", "Bank Transfer", "Wallet"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      merchant: "",
      amount: "",
      category: "",
      paymentMethod: "Cash",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!activeTracker?._id) {
      setError("Please select a tracker first");
      return;
    }

    if (!formData.merchant.trim() || !formData.amount || !formData.category || !formData.date) {
      setError("Merchant, amount, category, and date are required");
      return;
    }

    const success = await onCreateExpense({
      trackerId: activeTracker._id,
      ...formData,
    });

    if (success) {
      resetForm();
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
      <p className="text-sm text-zinc-400 mb-5">
        {activeTracker ? `Adding to: ${activeTracker.name}` : "Select a tracker first"}
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm ">Merchant</label>
          <input
            type="text"
            name="merchant"
            placeholder="e.g. Spotify"
            value={formData.merchant}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm ">Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="e.g. 199"
            value={formData.amount}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm ">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm ">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm ">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm ">Note</label>
          <textarea
            name="note"
            placeholder="Optional note"
            rows="3"
            value={formData.note}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !activeTracker}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "Adding expense..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}

export default CreateExpenseForm;