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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav
        className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8"
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
        <ul className="flex items-center gap-1">
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
        <div className="ml-auto flex items-center gap-3">
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
      </nav>
    </header>
  );
}
