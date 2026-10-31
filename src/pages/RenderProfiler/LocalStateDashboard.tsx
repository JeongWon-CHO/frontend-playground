import { useState } from "react";
import Dashboard from "@/components/RenderProfiler/Dashboard";
import type { DashboardProps } from "@/components/RenderProfiler/Dashboard";
import OrderList from "@/components/RenderProfiler/OrderList";
import { filterOrders } from "@/components/RenderProfiler/orders";

function SearchableOrders() {
  "use no memo";
  // After: search state belongs only to this subtree. The chart is its sibling.
  const [query, setQuery] = useState("");

  return (
    <OrderList
      orders={filterOrders(query)}
      query={query}
      onQueryChange={setQuery}
    />
  );
}

export default function LocalStateDashboard(props: DashboardProps) {
  "use no memo";
  return (
    <Dashboard {...props}>
      <SearchableOrders />
    </Dashboard>
  );
}
