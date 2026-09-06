import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <header className="header">Frontend Playground</header>

      <section className="section">
        <button
          className="section__button"
          onClick={() => navigate("/web-worker")}
        >
          Web Worker로 메인 스레드 병목 해결하기
        </button>
        <button className="section__button">
          React 렌더링 병목 직접 만들고 Profiling해서 최적화
        </button>
        <button className="section__button">
          React 렌더링 병목 직접 만들고 React.memo로 최적화
        </button>
        <button className="section__button">
          Vite 번들이 왜 커지는지 분석하고 Chunk Split 최적화
        </button>
      </section>
    </>
  );
}

export default Home;
