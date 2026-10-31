import "./RenderCard.css";
import "./OrderList.css";
import type { Order } from "./orders";
import { won } from "./orders";

type Props = {
  orders: Order[];
  query: string;
  onQueryChange: (query: string) => void;
};

export default function OrderList({ orders, query, onQueryChange }: Props) {
  return (
    <section className="render-card" aria-labelledby="orders-title">
      <div className="render-card-heading">
        <div>
          <h3 id="orders-title">
            주문 내역 <small>{orders.length.toLocaleString()}건</small>
          </h3>
        </div>
        <label className="order-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            aria-label="주문 검색"
            placeholder="상품, 고객, 주문번호 검색"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
      </div>
      <div className="order-table-scroll">
        <table className="order-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>상품</th>
              <th>고객</th>
              <th>결제 금액</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>
                  {order.product}
                  <small>{order.category}</small>
                </td>
                <td>{order.customer}</td>
                <td>{won(order.amount)}</td>
                <td>
                  <span
                    className={`order-status ${order.status === "완료" ? "is-complete" : ""}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan={5} className="order-empty">
                  검색 결과가 없어요. 다른 검색어를 입력해 보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="render-card-footnote">
        {orders.length
          ? `검색 결과 ${orders.length.toLocaleString()}건 중 처음 ${Math.min(10, orders.length)}건 표시`
          : "검색 결과 0건"}
        <span>고정된 실험용 데이터</span>
      </p>
    </section>
  );
}
