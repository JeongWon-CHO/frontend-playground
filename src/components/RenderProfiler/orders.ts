export type Order = {
  id: string;
  customer: string;
  product: string;
  category: string;
  month: number;
  amount: number;
  status: "완료" | "배송 중" | "준비 중";
};

const products = [
  ["Everyday tote", "Accessories", 29000],
  ["Desk organizer", "Living", 42000],
  ["Ceramic cup", "Living", 24000],
  ["Pocket notebook", "Stationery", 12000],
  ["Studio lamp", "Living", 89000],
  ["Canvas pouch", "Accessories", 18000],
] as const;
const customers = [
  "김민서",
  "이서준",
  "박지우",
  "최도윤",
  "정하린",
  "강시우",
  "조서연",
  "윤지호",
];
const statuses = ["완료", "배송 중", "준비 중"] as const;

// Fixed fixtures keep before/after recordings comparable. No network or randomness.
export const orders: Order[] = Array.from({ length: 1200 }, (_, index) => {
  const [product, category, price] = products[index % products.length];
  return {
    id: `ORD-${String(index + 1).padStart(4, "0")}`,
    customer: customers[index % customers.length],
    product,
    category,
    month: (Math.floor(index / products.length) % 12) + 1,
    amount: price * (1 + (index % 3)),
    status: statuses[Math.floor(index / 7) % statuses.length],
  };
});

export const totalRevenue = orders.reduce(
  (total, order) => total + order.amount,
  0,
);
export const won = (value: number) =>
  `₩${Math.round(value).toLocaleString("ko-KR")}`;
