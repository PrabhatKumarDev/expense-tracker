import { useNavigate } from "react-router-dom";
import { clearAuthData, getUser } from "../utils/authStorage";

function DashboardPage() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
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

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold mb-2">Auth Setup Complete</h2>
          <p className="text-zinc-400">
            Next we will secure routes properly and then start the expense module.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;