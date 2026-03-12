import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../shared/assets/logo.svg";
import { Button } from "../../shared/ui-kit/button";
import { Input } from "../../shared/ui-kit/input";
import { useAuth } from "../../features/auth";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [loginVal, setLoginVal] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
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

    return (
        <main className="min-h-screen flex items-center justify-center bg-default">
            <article className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">

                <header className="flex items-center gap-3 justify-center">
                    <img src={logo} alt="" aria-hidden="true" className="w-10 h-10" />
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Войдите в</p>
                        <h1 className="text-2xl font-semibold text-green-primary">AgroScope</h1>
                    </div>
                </header>

                <aside className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
                    <p className="font-medium text-gray-600">Тестовые учётные данные:</p>
                    <ul className="space-y-0.5">
                        <li>Гость: <span className="font-mono">guest / guest</span></li>
                        <li>Агроном: <span className="font-mono">agronomist / agronomist</span></li>
                    </ul>
                </aside>

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
                        <p role="alert" className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading ? "Входим..." : "Войти"}
                    </Button>
                </form>

            </article>
        </main>
    );
}
