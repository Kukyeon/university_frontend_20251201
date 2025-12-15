import "./SectionLayout.css";
import "./Card.css";

const SectionLayout = ({ title, sidebar, children }) => {
  return (
    <div className="section-container">
      <div className="section-layout">
        <aside className="section-sidebar">
          <h2>{title}</h2>
          {sidebar}
        </aside>

        <main className="section-content">
          <div className="section-card">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SectionLayout;
