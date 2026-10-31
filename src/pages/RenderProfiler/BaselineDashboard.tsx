import { useState } from "react";
import Dashboard from "@/components/RenderProfiler/Dashboard";
import type { DashboardProps } from "@/components/RenderProfiler/Dashboard";
import OrderList from "@/components/RenderProfiler/OrderList";
import { filterOrders } from "@/components/RenderProfiler/orders";

export default function BaselineDashboard(props: DashboardProps) {
  "use no memo";
  // Before: a search update rerenders the shared parent of the list and chart.
  const [query, setQuery] = useState("");

  return (
    <Dashboard {...props}>
      <OrderList
        orders={filterOrders(query)}
        query={query}
        onQueryChange={setQuery}
      />
    </Dashboard>
  );
}
