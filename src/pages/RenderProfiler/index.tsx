import { useState } from "react";
import OrderList from "@/components/RenderProfiler/OrderList";
import RevenueChart from "@/components/RenderProfiler/RevenueChart";
import { orders, totalRevenue, won } from "@/components/RenderProfiler/orders";
import "./RenderProfiler.css";

export default function RenderProfiler() {
  "use no memo";
  // Baseline: search state intentionally lives above both the list and chart.
  // Keep Compiler optimization off here so unrelated children are not cached.
  const [query, setQuery] = useState("");
  const [samples, setSamples] = useState(10000);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product} ${order.category}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <main className="render-lab">
      <div className="render-lab-intro">
        <div>
          <span className="render-eyebrow">EXPERIMENT 002 / BASELINE</span>
          <h2>
            A little lag,
            <br />
            <em>a longer story.</em>
          </h2>
          <p>검색창에 입력해 보세요. 작은 입력이 어디까지 영향을 줄까요?</p>
        </div>
        <div className="render-baseline">
          <span className="render-badge">● 느린 버전</span>
          <p>
            같은 데이터, 같은 화면.
            <br />
            아직 최적화하지 않은 시작점입니다.
          </p>
        </div>
      </div>
      <aside className="render-instructions" aria-label="실험 안내">
        <p>
          <strong>직접 해보기</strong> 검색창에 <b>ceramic</b>을 입력하고
          지워보세요. 타이핑한 글자가 뒤늦게 나타나는지 확인해 보세요. 지연이
          작다면 계산량을 높여보세요.
        </p>
        <label>
          예측 계산량{" "}
          <select
            value={samples}
            onChange={(event) => setSamples(Number(event.target.value))}
          >
            <option value={1000}>낮음 · 1,000회 / 주문</option>
            <option value={10000}>기본 · 10,000회 / 주문</option>
            <option value={30000}>높음 · 30,000회 / 주문</option>
          </select>
        </label>
      </aside>
      <div className="render-stats">
        <div>
          <span>총 매출</span>
          <strong>{won(totalRevenue)}</strong>
          <small>전체 주문의 결제 금액</small>
        </div>
        <div>
          <span>누적 주문</span>
          <strong>
            1,200 <i>orders</i>
          </strong>
          <small>2026년 실험용 주문 데이터</small>
        </div>
        <div>
          <span>평균 주문 금액</span>
          <strong>{won(totalRevenue / orders.length)}</strong>
          <small>검색과 무관한 전체 통계</small>
        </div>
      </div>
      <RevenueChart samples={samples} />
      <OrderList orders={filtered} query={query} onQueryChange={setQuery} />
      <footer className="render-lab-footer">
        <span>EVERY RENDER TELLS A STORY.</span>
        <p>
          관찰할 것은 차트의 움직임이 아니라 검색창의 입력 지연입니다. 차트는
          같은 값을 다시 계산하므로 모양이 그대로예요.
        </p>
      </footer>
    </main>
  );
}
