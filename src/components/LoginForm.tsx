import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../shared/assets/logo.svg";
import { Button } from "../shared/ui-kit/button";
import { Input } from "../shared/ui-kit/input";
import { useAuth } from "../features/auth";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginVal, setLoginVal] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!loginVal.trim() || !password) {
      setError("Введите логин и пароль");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(loginVal, password);
      setLoading(false);
      if (ok) {
        navigate("/dashboard");
      } else {
        setError("Неверный логин или пароль");
      }
    }, 400);
  };

  const handleGuestLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login("guest", "guest");
      setLoading(false);
      if (ok) navigate("/dashboard");
      else setError("Не удалось войти под гостем");
    }, 300);
  };

  return (
    <article className="w-full rounded-lg border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/10 sm:p-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-primary">
            <img src={logo} alt="" aria-hidden="true" className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-primary">
              AgroScope
            </p>
            <h2 className="text-2xl font-semibold text-gray-950">Войти в аккаунт</h2>
          </div>
        </div>
        <p className="text-sm leading-6 text-gray-500">
          Используйте гостевой вход для быстрого просмотра или войдите под своей учетной записью.
        </p>
      </header>

      <button
        type="button"
        onClick={handleGuestLogin}
        disabled={loading}
        className="mt-6 flex h-11 w-full items-center justify-center rounded-lg border border-green-primary bg-green-50 text-sm font-semibold text-green-primary transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Войти под гостем
      </button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">или вручную</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1">
          <label htmlFor="login" className="block text-sm font-medium text-gray-700">
            Логин
          </label>
          <Input
            id="login"
            type="text"
            placeholder="Введите логин"
            value={loginVal}
            onChange={(e) => setLoginVal(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Пароль
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-400">
        Демо-доступ сохраняется только в текущей сессии браузера.
      </p>
    </article>
  );
}
