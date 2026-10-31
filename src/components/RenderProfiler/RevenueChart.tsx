import "./RenderCard.css";
import "./RevenueChart.css";
import { calculateForecast } from "./calculateForecast";
import { orders, won } from "./orders";

export default function RevenueChart({ samples }: { samples: number }) {
  "use no memo";
  // Experimental control: Compiler must not cache this calculation. Search does
  // not affect this chart's data, but parent updates still rerender it.
  const months = calculateForecast(orders, samples);
  const maximum = Math.max(...months);
  const total = months.reduce((sum, amount) => sum + amount, 0);

  return (
    <section
      className="render-card revenue-card"
      aria-labelledby="revenue-title"
    >
      <div className="render-card-heading">
        <div>
          <h3 id="revenue-title">월별 예상 매출</h3>
        </div>
        <span className="render-chart-legend">
          <i /> 전체 주문 기준
        </span>
      </div>
      <div className="render-chart-total">
        {won(total)} <span>연간 예측 합계</span>
      </div>
      <div
        className="revenue-chart"
        role="img"
        aria-label={`1월부터 12월까지 예상 매출. 연간 합계 ${won(total)}`}
      >
        {months.map((amount, index) => (
          <div className="revenue-column" key={index}>
            <div className="revenue-bar-track">
              <div
                className="revenue-bar"
                style={{ height: `${(amount / maximum) * 100}%` }}
              >
                <span>{won(amount)}</span>
              </div>
            </div>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
      <p className="render-card-footnote">
        2026.01 — 2026.12{" "}
        <span>검색 조건과 관계없이 전체 주문으로 예측합니다.</span>
      </p>
      <details className="render-chart-data">
        <summary>월별 수치 보기</summary>
        <dl>
          {months.map((amount, index) => (
            <div key={index}>
              <dt>{index + 1}월</dt>
              <dd>{won(amount)}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
