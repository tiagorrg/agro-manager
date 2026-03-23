import type { ReactNode } from "react";
import Navbar from "../widgets/navbar";

interface LayoutProps {
  children: ReactNode;
  variant?: "default" | "fullBleed";
}

export default function Layout({ children, variant = "default" }: LayoutProps) {
  return (
    <div className={`bg-default flex flex-col ${variant === "fullBleed" ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <div className="print:hidden">
        <Navbar />
      </div>
      {variant === "fullBleed" ? (
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
          {children}
        </main>
      )}
    </div>
  );
}
