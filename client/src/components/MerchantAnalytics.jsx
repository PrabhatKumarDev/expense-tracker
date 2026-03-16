import { useMemo } from "react";

function MerchantAnalytics({ expenses }) {
  const merchantData = useMemo(() => {
    const merchantMap = {};

    expenses.forEach((expense) => {
      const key = expense.normalizedMerchant;

      if (!merchantMap[key]) {
        merchantMap[key] = {
          name: expense.merchant,
          total: 0,
          count: 0,
        };
      }

      merchantMap[key].total += expense.amount;
      merchantMap[key].count += 1;
    });

    return Object.values(merchantMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [expenses]);

  if (!merchantData.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold mb-2">Top Merchants</h2>
        <p className="text-zinc-400">No merchant data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold mb-4">Top Merchants</h2>

      <div className="space-y-4">
        {merchantData.map((merchant, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-zinc-800 pb-3"
          >
            <div>
              <p className="font-medium">{merchant.name}</p>
              <p className="text text-zinc-400">
                {merchant.count} transaction(s)
              </p>
            </div>

            <p className="font-semibold">
              ₹{merchant.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MerchantAnalytics;