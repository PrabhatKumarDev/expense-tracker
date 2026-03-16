import { useState } from "react";

function ExpenseFilters({ onFilter }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    onFilter({
      search: value,
      category,
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);

    onFilter({
      search,
      category: value,
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search merchant..."
          value={search}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-violet-500"
        />

        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-violet-500"
        >
          <option value="">All Categories</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Health</option>
          <option>Education</option>
          <option>Office</option>
          <option>Home</option>
          <option>Subscription</option>
        </select>
      </div>
    </div>
  );
}

export default ExpenseFilters;