import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTracker, getTrackers } from "../api/trackerApi";
import { createExpense, getExpenses } from "../api/expenseApi";
import { getCurrentUser } from "../api/authApi";
import TrackerList from "../components/TrackerList";
import CreateTrackerForm from "../components/CreateTrackerForm";
import CreateExpenseForm from "../components/CreateExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { deleteExpense,updateExpense } from "../api/expenseApi";
import EditExpenseModal from "../components/EditExpenseModal";
import MerchantAnalytics from "../components/MerchantAnalytics";
import Insights from "../components/Insights";
import MonthlyChart from "../components/MonthlyChart";
import CategoryChart from "../components/CategoryChart";
import ExpenseFilters from "../components/ExpenseFilters";
import ThemeToggle from "../components/ThemeToggle";
import ExportButtons from "../components/ExportButtons";
import {
  clearAuthData,
  getUser,
  setAuthData,
  getToken,
} from "../utils/authStorage";
import {
  clearActiveTracker,
  getActiveTracker,
  setActiveTracker,
} from "../utils/trackerStorage";

function DashboardPage({theme,setTheme}) {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser());
  const [trackers, setTrackers] = useState([]);
  const [activeTracker, setActiveTrackerState] = useState(getActiveTracker());
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
const [editLoading, setEditLoading] = useState(false);

  const handleLogout = () => {
    clearAuthData();
    clearActiveTracker();
    navigate("/login");
  };

  const fetchExpensesForTracker = async (trackerId) => {
    try {
      setExpensesLoading(true);
      const data = await getExpenses(trackerId);
      setExpenses(data.expenses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load expenses");
      setExpenses([]);
    } finally {
      setExpensesLoading(false);
    }
  };

  const handleSelectTracker = (tracker) => {
    setActiveTrackerState(tracker);
    setActiveTracker(tracker);
    fetchExpensesForTracker(tracker._id);
  };

  const handleEditExpense = (expense) => {
  setEditingExpense(expense);
};

const handleSaveExpense = async (id, formData) => {
  try {
    setEditLoading(true);
    setError("");

    const data = await updateExpense(id, formData);

    setExpenses((prev) =>
      prev.map((expense) =>
        expense._id === id ? data.expense : expense
      )
    );

    return true;
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update expense");
    return false;
  } finally {
    setEditLoading(false);
  }
};

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);

      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleCreateTracker = async (formData) => {
    try {
      setTrackerLoading(true);
      setError("");

      const data = await createTracker(formData);
      const updatedTrackers = [...trackers, data.tracker];
      setTrackers(updatedTrackers);

      if (!activeTracker) {
        handleSelectTracker(data.tracker);
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create tracker");
      return false;
    } finally {
      setTrackerLoading(false);
    }
  };

  const handleCreateExpense = async (formData) => {
    try {
      setExpenseLoading(true);
      setError("");

      const data = await createExpense(formData);
      setExpenses((prev) => [data.expense, ...prev]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create expense");
      return false;
    } finally {
      setExpenseLoading(false);
    }
  };
  const handleFilter = ({ search, category }) => {
  let filtered = [...expenses];

  if (search) {
    filtered = filtered.filter((expense) =>
      expense.merchant.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category) {
    filtered = filtered.filter(
      (expense) => expense.category === category
    );
  }

  setFilteredExpenses(filtered);
};
  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError("");

        const [userData, trackerData] = await Promise.all([
          getCurrentUser(),
          getTrackers(),
        ]);

        setUser(userData.user);

        const token = getToken();
        if (token) {
          setAuthData({
            token,
            user: userData.user,
          });
        }

        setTrackers(trackerData.trackers);

        const storedTracker = getActiveTracker();

        let trackerToUse = null;

        if (storedTracker) {
          trackerToUse =
            trackerData.trackers.find(
              (tracker) => tracker._id === storedTracker._id,
            ) || null;
        }

        if (!trackerToUse && trackerData.trackers.length > 0) {
          trackerToUse = trackerData.trackers[0];
        }

        if (trackerToUse) {
          setActiveTrackerState(trackerToUse);
          setActiveTracker(trackerToUse);
          await fetchExpensesForTracker(trackerToUse._id);
        } else {
          setExpenses([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
        clearAuthData();
        clearActiveTracker();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading dashboard...</p>
      </div>
    );
  }
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTransactions = expenses.length;
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">
              Welcome back, {user?.name || "User"}
            </p>
          </div>

          <div className="flex gap-3">
  <ThemeToggle
    theme={theme}
    onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
  />
  <button
    onClick={handleLogout}
    className="rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 hover:border-violet-500 transition"
  >
    Logout
  </button>
</div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold mb-2">Active Tracker</h2>
              <p className="text-zinc-400">
                Color: {activeTracker?.color || "-"} • Icon: {activeTracker?.icon || "-"}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
                <p className="text-sm text-zinc-400">Total Spent</p>
                <h3 className="text-2xl font-semibold mt-1">₹{totalAmount}</h3>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
                <p className="text-sm text-zinc-400">Transactions</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {totalTransactions}
                </h3>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
                <p className="text-sm text-zinc-400">Current Tracker</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {activeTracker?.name || "-"}
                </h3>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Trackers</h2>
              <TrackerList
                trackers={trackers}
                activeTracker={activeTracker}
                onSelectTracker={handleSelectTracker}
              />
            </div>
             <ExpenseFilters onFilter={handleFilter} />
            <ExpenseList
              expenses={filteredExpenses}
              loading={expensesLoading}
              activeTracker={activeTracker}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
            />
            <div className="grid gap-6 lg:grid-cols-2 mt-6">
              <MonthlyChart expenses={expenses} />
              <CategoryChart expenses={expenses} />
            </div>
            <div>
              <div className="mt-6">
                <MerchantAnalytics expenses={expenses} />
              </div>
              <div className="mt-6">
                <Insights expenses={expenses} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CreateTrackerForm
              onCreateTracker={handleCreateTracker}
              loading={trackerLoading}
            />

            <CreateExpenseForm
              activeTracker={activeTracker}
              onCreateExpense={handleCreateExpense}
              loading={expenseLoading}
            />
            <ExportButtons expenses={filteredExpenses} activeTracker={activeTracker} />
          </div>
          
        </div>
      </div>
      <EditExpenseModal
  expense={editingExpense}
  isOpen={!!editingExpense}
  onClose={() => setEditingExpense(null)}
  onSave={handleSaveExpense}
  loading={editLoading}
/>
    </div>
  );
}

export default DashboardPage;
