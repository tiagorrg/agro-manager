import Navbar from "../widgets/navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-default flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        {children}
      </main>
    </div>
  );
}
