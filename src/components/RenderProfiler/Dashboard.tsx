import "./Dashboard.css";
import type { ReactNode } from "react";
import RevenueChart from "./RevenueChart";
import { orders, totalRevenue, won } from "./orders";

export type DashboardProps = {
  samples: number;
  onSamplesChange: (samples: number) => void;
};

type Props = DashboardProps & {
  children: ReactNode;
};

export default function Dashboard({
  samples,
  onSamplesChange,
  children,
}: Props) {
  "use no memo";
  // Keep the shared layout unoptimized in both versions, so Compiler caching
  // cannot hide the baseline chart updates. Only state ownership differs.
  return (
    <>
      <div className="render-lab-intro">
        <div>
          <h2>
            A little lag,
            <br />
            <em>a longer story.</em>
          </h2>
        </div>
      </div>
      <div className="render-controls">
        <label>
          예측 계산량{" "}
          <select
            value={samples}
            onChange={(event) => onSamplesChange(Number(event.target.value))}
          >
            <option value={1000}>낮음 · 1,000회 / 주문</option>
            <option value={10000}>기본 · 10,000회 / 주문</option>
            <option value={30000}>높음 · 30,000회 / 주문</option>
          </select>
        </label>
      </div>
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
      {children}
    </>
  );
}
