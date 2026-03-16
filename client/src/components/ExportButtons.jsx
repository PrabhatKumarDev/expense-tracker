import { exportExpensesToCsv } from "../utils/exportCsv";
import { exportExpensesToPdf } from "../utils/exportPdf";

function ExportButtons({ expenses, activeTracker }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold mb-4">Export Report</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => exportExpensesToCsv(expenses, activeTracker?.name)}
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white hover:border-violet-500"
        >
          Export CSV
        </button>

        <button
          onClick={() => exportExpensesToPdf(expenses, activeTracker?.name)}
          className="rounded-xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-500"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}

export default ExportButtons;