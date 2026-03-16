import { useEffect, useMemo, useState } from "react";
import { getBudget, setBudget } from "../api/budgetApi";

function BudgetCard({ activeTracker, expenses }) {
  const [budgetAmount, setBudgetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7);

  const thisMonthSpent = useMemo(() => {
    return expenses
      .filter(
        (expense) =>
          new Date(expense.date).toISOString().slice(0, 7) === currentMonth
      )
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses, currentMonth]);

  const budgetNumber = Number(budgetAmount || 0);
  const remaining = Math.max(budgetNumber - thisMonthSpent, 0);
  const usage = budgetNumber > 0 ? (thisMonthSpent / budgetNumber) * 100 : 0;
  const cappedUsage = Math.min(usage, 100);

  useEffect(() => {
    const fetchBudget = async () => {
      if (!activeTracker?._id) {
        setBudgetAmount("");
        return;
      }

      try {
        setMessage("");
        const data = await getBudget(activeTracker._id, currentMonth);
        setBudgetAmount(data.budget?.amount?.toString() || "");
      } catch (error) {
        setBudgetAmount("");
      }
    };

    fetchBudget();
  }, [activeTracker, currentMonth]);

  const handleSaveBudget = async () => {
    if (!activeTracker?._id) return;

    try {
      setLoading(true);
      setMessage("");

      await setBudget({
        trackerId: activeTracker._id,
        month: currentMonth,
        amount: Number(budgetAmount || 0),
      });

      setMessage("Budget saved successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
        Monthly Budget
      </h2>

      <div className="space-y-4">
        <input
          type="number"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          placeholder="Set budget amount"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
        />

        <button
          onClick={handleSaveBudget}
          disabled={loading || !activeTracker}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Budget"}
        </button>

        {message && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
        )}

        <div className="space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Month: {currentMonth}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Spent this month: ₹{thisMonthSpent}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Remaining: ₹{remaining}
          </p>

          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full ${
                usage > 100 ? "bg-red-500" : "bg-violet-500"
              }`}
              style={{ width: `${cappedUsage}%` }}
            />
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {budgetNumber > 0 ? `${usage.toFixed(0)}% used` : "No budget set"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BudgetCard;