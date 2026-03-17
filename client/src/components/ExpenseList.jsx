import { deleteExpense } from "../api/expenseApi";
import { Pencil,Trash2 } from "lucide-react";
function ExpenseList({ expenses, loading, activeTracker, onDeleteExpense,onEditExpense }) {
  if (!activeTracker) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
        <p className="text-zinc-400">Select a tracker to view expenses.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
        <p className="text-zinc-400">Loading expenses...</p>
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold mb-2">Expenses</h2>
        <p className="text-zinc-400">
          No expenses yet for{" "}
          <span className="text-white">{activeTracker.name}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <span className="text-sm text-zinc-400">{expenses.length} item(s)</span>
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-medium ">
                  {expense.merchant}
                </h3>
                <p className="text-sm  mt-1">
                  {expense.category} • {expense.paymentMethod}
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
                {expense.note && (
                  <p className="text-sm text-zinc-400 mt-2">{expense.note}</p>
                )}
              </div>

              <div className="text-left sm:text-right">
  <p className="text-xl font-semibold ">₹{expense.amount}</p>

  <div className="mt-2 flex gap-3 sm:justify-end">
    <button
      onClick={() => onEditExpense(expense)}
      className="text-xs text-violet-400 hover:text-violet-300"
    >
      <Pencil />
    </button>

    <button
      onClick={() => onDeleteExpense(expense._id)}
      className="text-xs text-red-400 hover:text-red-300"
    >
      <Trash2 />
    </button>
  </div>
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;
