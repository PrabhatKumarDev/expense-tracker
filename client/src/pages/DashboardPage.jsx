import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTracker, getTrackers } from "../api/trackerApi";
import {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../api/expenseApi";
import { getCurrentUser } from "../api/authApi";
import TrackerList from "../components/TrackerList";
import CreateTrackerForm from "../components/CreateTrackerForm";
import CreateExpenseForm from "../components/CreateExpenseForm";
import ExpenseList from "../components/ExpenseList";
import EditExpenseModal from "../components/EditExpenseModal";
import MerchantAnalytics from "../components/MerchantAnalytics";
import Insights from "../components/Insights";
import MonthlyChart from "../components/MonthlyChart";
import CategoryChart from "../components/CategoryChart";
import ExpenseFilters from "../components/ExpenseFilters";
import ThemeToggle from "../components/ThemeToggle";
import ExportButtons from "../components/ExportButtons";
import BudgetCard from "../components/BudgetCard";
import { updateTracker, deleteTracker } from "../api/trackerApi";
import EditTrackerModal from "../components/EditTrackerModal";
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

function DashboardPage({ theme, setTheme }) {
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
  const [editingTracker, setEditingTracker] = useState(null);
const [trackerEditLoading, setTrackerEditLoading] = useState(false);

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
        prev.map((expense) => (expense._id === id ? data.expense : expense))
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
      filtered = filtered.filter((expense) => expense.category === category);
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
              (tracker) => tracker._id === storedTracker._id
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
      <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-white flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
      </div>
    );
  }

  const handleEditTracker = (tracker) => {
  setEditingTracker(tracker);
};

const handleSaveTracker = async (id, formData) => {
  try {
    setTrackerEditLoading(true);
    setError("");

    const data = await updateTracker(id, formData);

    setTrackers((prev) =>
      prev.map((tracker) => (tracker._id === id ? data.tracker : tracker))
    );

    if (activeTracker?._id === id) {
      setActiveTrackerState(data.tracker);
      setActiveTracker(data.tracker);
    }

    return true;
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update tracker");
    return false;
  } finally {
    setTrackerEditLoading(false);
  }
};

const handleDeleteTracker = async (tracker) => {
  const confirmed = window.confirm(
    `Delete "${tracker.name}"? This cannot be undone.`
  );

  if (!confirmed) return;

  try {
    setError("");
    await deleteTracker(tracker._id);

    const updatedTrackers = trackers.filter((t) => t._id !== tracker._id);
    setTrackers(updatedTrackers);

    if (activeTracker?._id === tracker._id) {
      const nextTracker = updatedTrackers[0] || null;
      setActiveTrackerState(nextTracker);
      setActiveTracker(nextTracker);

      if (nextTracker) {
        fetchExpensesForTracker(nextTracker._id);
      } else {
        clearActiveTracker();
        setExpenses([]);
      }
    }
  } catch (err) {
    setError(err.response?.data?.message || "Failed to delete tracker");
  }
};

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTransactions = expenses.length;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-white px-6 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
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
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition hover:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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

       <div className="xl:hidden space-y-6">
  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 className="mb-2 text-xl font-semibold">Active Tracker</h2>
    <p className="text-zinc-600 dark:text-zinc-400">
      {activeTracker
        ? `Currently viewing: ${activeTracker.name}`
        : "Select a tracker to continue"}
    </p>
    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
      Color: {activeTracker?.color || "-"} • Icon: {activeTracker?.icon || "-"}
    </p>
  </div>

  <div className="grid gap-4 sm:grid-cols-2">
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Spent</p>
      <h3 className="mt-1 text-2xl font-semibold">₹{totalAmount}</h3>
    </div>

    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Transactions</p>
      <h3 className="mt-1 text-2xl font-semibold">{totalTransactions}</h3>
    </div>
  </div>

  <BudgetCard activeTracker={activeTracker} expenses={expenses} />
  <CreateExpenseForm
    activeTracker={activeTracker}
    onCreateExpense={handleCreateExpense}
    loading={expenseLoading}
  />


  <CreateTrackerForm
    onCreateTracker={handleCreateTracker}
    loading={trackerLoading}
  />

  <div>
    <h2 className="mb-4 text-2xl font-semibold">Your Trackers</h2>
    <TrackerList
  trackers={trackers}
  activeTracker={activeTracker}
  onSelectTracker={handleSelectTracker}
  onEditTracker={handleEditTracker}
  onDeleteTracker={handleDeleteTracker}
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

  <div className="grid gap-6 lg:grid-cols-2">
    <MonthlyChart expenses={expenses} />
    <CategoryChart expenses={expenses} />
  </div>

  <MerchantAnalytics expenses={expenses} />
  <Insights expenses={expenses} />
  <ExportButtons expenses={filteredExpenses} activeTracker={activeTracker} />
</div>

<div className="hidden xl:grid xl:grid-cols-[1.2fr_0.8fr] xl:gap-6">
  <div className="space-y-6">
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-2 text-xl font-semibold">Active Tracker</h2>
      <p className="text-zinc-600 dark:text-zinc-400">
        {activeTracker
          ? `Currently viewing: ${activeTracker.name}`
          : "Select a tracker to continue"}
      </p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
        Color: {activeTracker?.color || "-"} • Icon: {activeTracker?.icon || "-"}
      </p>
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Spent</p>
        <h3 className="mt-1 text-2xl font-semibold">₹{totalAmount}</h3>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Transactions</p>
        <h3 className="mt-1 text-2xl font-semibold">{totalTransactions}</h3>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Current Tracker</p>
        <h3 className="mt-1 text-2xl font-semibold">{activeTracker?.name || "-"}</h3>
      </div>
    </div>

    <div>
      <h2 className="mb-4 text-2xl font-semibold">Your Trackers</h2>
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

    <div className="grid gap-6 2xl:grid-cols-2">
      <MonthlyChart expenses={expenses} />
      <CategoryChart expenses={expenses} />
    </div>

    <MerchantAnalytics expenses={expenses} />
    <Insights expenses={expenses} />
  </div>

  <div className="space-y-6">
      <BudgetCard activeTracker={activeTracker} expenses={expenses} />
    <CreateExpenseForm
      activeTracker={activeTracker}
      onCreateExpense={handleCreateExpense}
      loading={expenseLoading}
    />


    <CreateTrackerForm
      onCreateTracker={handleCreateTracker}
      loading={trackerLoading}
    />

    <ExportButtons expenses={filteredExpenses} activeTracker={activeTracker} />
  </div>
</div>
      </div>
<EditTrackerModal
  tracker={editingTracker}
  isOpen={!!editingTracker}
  onClose={() => setEditingTracker(null)}
  onSave={handleSaveTracker}
  loading={trackerEditLoading}
/>
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