import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { fetchOperations } from "../../shared/api/operations";
import logo from "../../shared/assets/logo.svg";

const NAV_LINKS = [
  { to: "/dashboard",  label: "Дашборд"   },
  { to: "/map",        label: "Карта"      },
  { to: "/fields",     label: "Поля"       },
  { to: "/calendar",   label: "Календарь"  },
  { to: "/operations", label: "Журнал"     },
  { to: "/documents",  label: "Документы"  },
  { to: "/reports",    label: "Отчёты"    },
];

const ROLE_LABELS: Record<string, string> = {
  agronomist: "Агроном",
  manager:    "Менеджер",
  guest:      "Гость",
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todayCount, setTodayCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchOperations()
      .then((ops) => {
        const today = todayStr();
        const count = ops.filter(
          (op) => op.date === today && op.calendarStatus !== "Выполнено"
        ).length;
        setTodayCount(count);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4 lg:gap-8"
        aria-label="Основная навигация"
      >
        {/* Логотип */}
        <NavLink to="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-green-primary">
            <img src={logo} alt="" aria-hidden="true" className="w-4 h-4" />
          </span>
          <span className="text-base font-semibold text-green-primary tracking-tight">
            AgroScope
          </span>
        </NavLink>

        {/* Ссылки */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative",
                    isActive
                      ? "bg-green-primary text-white"
                      : "text-gray-600 hover:bg-gray-100",
                  ].join(" ")
                }
              >
                {label}
                {to === "/calendar" && todayCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                    {todayCount > 9 ? "9+" : todayCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Пользователь */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {ROLE_LABELS[user?.role ?? "guest"] ?? "Гость"}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-1"
            aria-label="Выйти из системы"
          >
            Выйти
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
        >
          <span className="sr-only">{menuOpen ? "Закрыть меню" : "Открыть меню"}</span>
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[80] md:hidden transition ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-gray-950/45 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Закрыть меню"
          tabIndex={menuOpen ? 0 : -1}
        />

        <aside
          className={`relative h-full w-[82vw] max-w-xs bg-white shadow-2xl shadow-gray-950/25 transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Мобильное меню"
        >
          <div className="px-4 py-4 flex items-center justify-between gap-3 border-b border-gray-100">
            <NavLink
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 shrink-0"
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary">
                <img src={logo} alt="" aria-hidden="true" className="w-4 h-4" />
              </span>
              <span className="text-base font-semibold text-green-primary tracking-tight">
                AgroScope
              </span>
            </NavLink>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-2xl leading-none"
              aria-label="Закрыть меню"
              tabIndex={menuOpen ? 0 : -1}
            >
              ×
            </button>
          </div>

          <div className="px-4 py-4 flex items-center justify-between gap-3 border-b border-gray-100">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">{ROLE_LABELS[user?.role ?? "guest"] ?? "Гость"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
              tabIndex={menuOpen ? 0 : -1}
            >
              Выйти
            </button>
          </div>

          <ul className="px-3 py-3 grid gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                  className={({ isActive }) =>
                    [
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-green-primary text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    ].join(" ")
                  }
                >
                  <span>{label}</span>
                  {to === "/calendar" && todayCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold leading-none">
                      {todayCount > 9 ? "9+" : todayCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </header>
  );
}
