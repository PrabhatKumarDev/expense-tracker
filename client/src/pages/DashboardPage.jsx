import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTracker, getTrackers } from "../api/trackerApi";
import { getCurrentUser } from "../api/authApi";
import TrackerList from "../components/TrackerList";
import CreateTrackerForm from "../components/CreateTrackerForm";
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

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser());
  const [trackers, setTrackers] = useState([]);
  const [activeTracker, setActiveTrackerState] = useState(getActiveTracker());
  const [loading, setLoading] = useState(true);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    clearAuthData();
    clearActiveTracker();
    navigate("/login");
  };

  const handleSelectTracker = (tracker) => {
    setActiveTrackerState(tracker);
    setActiveTracker(tracker);
  };

  const handleCreateTracker = async (formData) => {
    try {
      setTrackerLoading(true);
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

        if (storedTracker) {
          const matchedTracker = trackerData.trackers.find(
            (tracker) => tracker._id === storedTracker._id
          );

          if (matchedTracker) {
            setActiveTrackerState(matchedTracker);
            setActiveTracker(matchedTracker);
          } else if (trackerData.trackers.length > 0) {
            setActiveTrackerState(trackerData.trackers[0]);
            setActiveTracker(trackerData.trackers[0]);
          }
        } else if (trackerData.trackers.length > 0) {
          setActiveTrackerState(trackerData.trackers[0]);
          setActiveTracker(trackerData.trackers[0]);
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">
              Welcome back, {user?.name || "User"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 hover:border-violet-500 transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-xl font-semibold mb-2">Active Tracker</h2>
              <p className="text-zinc-400">
                {activeTracker
                  ? `Currently viewing: ${activeTracker.name}`
                  : "Select a tracker to continue"}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Trackers</h2>
              <TrackerList
                trackers={trackers}
                activeTracker={activeTracker}
                onSelectTracker={handleSelectTracker}
              />
            </div>
          </div>

          <div>
            <CreateTrackerForm
              onCreateTracker={handleCreateTracker}
              loading={trackerLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;