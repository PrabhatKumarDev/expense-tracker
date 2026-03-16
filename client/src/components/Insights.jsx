import { useMemo } from "react";

function Insights({ expenses }) {
  const insights = useMemo(() => {
    if (!expenses.length) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;

    const categoryTotals = {};
    const merchantCounts = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.date);

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        thisMonthTotal += expense.amount;
      }

      if (
        date.getMonth() === currentMonth - 1 &&
        date.getFullYear() === currentYear
      ) {
        lastMonthTotal += expense.amount;
      }

      // category totals
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }

      categoryTotals[expense.category] += expense.amount;

      // merchant counts
      const merchant = expense.normalizedMerchant;

      if (!merchantCounts[merchant]) {
        merchantCounts[merchant] = 0;
      }

      merchantCounts[merchant] += 1;
    });

    const result = [];

    // Monthly spend
    result.push(`You spent ₹${thisMonthTotal} this month.`);

    // Month comparison
    if (lastMonthTotal > 0) {
      const change = Math.round(
        ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      );

      if (change > 0) {
        result.push(`That's ${change}% more than last month.`);
      } else if (change < 0) {
        result.push(`That's ${Math.abs(change)}% less than last month.`);
      }
    }

    // Top category
    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (topCategory) {
      result.push(
        `Your biggest category is ${topCategory[0]} (₹${topCategory[1]}).`
      );
    }

    // Recurring merchants
    Object.entries(merchantCounts).forEach(([merchant, count]) => {
      if (count >= 3) {
        result.push(
          `${merchant} appears ${count} times. This might be a recurring subscription.`
        );
      }
    });

    return result;
  }, [expenses]);

  if (!insights.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold mb-2">Insights</h2>
        <p className="text-zinc-400">Not enough data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold mb-4">Insights</h2>

      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <li key={index} className="">
            💡 {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Insights;