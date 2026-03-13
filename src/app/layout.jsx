import Navbar from "../widgets/navbar";

export default function Layout({ children, variant = "default" }) {
  return (
    <div className={`bg-default flex flex-col ${variant === "fullBleed" ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <Navbar />
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
