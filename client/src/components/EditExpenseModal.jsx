import { useEffect, useState } from "react";

function EditExpenseModal({ expense, isOpen, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    category: "",
    paymentMethod: "Cash",
    date: "",
    note: "",
  });

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

  useEffect(() => {
    if (expense) {
      setFormData({
        merchant: expense.merchant || "",
        amount: expense.amount || "",
        category: expense.category || "",
        paymentMethod: expense.paymentMethod || "Cash",
        date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : "",
        note: expense.note || "",
      });
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSave(expense._id, formData);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">Edit Expense</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="merchant"
            value={formData.merchant}
            onChange={handleChange}
            placeholder="Merchant"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          />

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          />

          <textarea
            name="note"
            rows="3"
            value={formData.note}
            onChange={handleChange}
            placeholder="Note"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-violet-500 resize-none"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 text-white"
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

export default EditExpenseModal;