import type { ReactNode } from "react";

interface Props {
  sidebar: ReactNode;
  main: ReactNode;
}

export function Dashboard({ sidebar, main }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: "16px",
        padding: "16px 24px",
        minHeight: "calc(100vh - 50px)",
      }}
    >
      {/* Sidebar — collapses on mobile */}
      <aside
        style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 80px)",
        }}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <main>{main}</main>
    </div>
  );
}
