import LoginForm from "../../components/LoginForm";
import FieldsMiniMap from "../../widgets/dashboard/FieldsMiniMap";
import logo from "../../shared/assets/logo.svg";
import loginBackground from "../../shared/assets/login/agro-login-fields-bg.png";

const FIELD_STATS = [
  { label: "Полей в контуре", value: "10" },
  { label: "Площадь", value: "921.7 га" },
  { label: "План до июня", value: "31 задача" },
];

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f2e8] text-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${loginBackground})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#faf7ed]/88 via-[#faf7ed]/42 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-[#f6f2e8]/20" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 px-5 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8">
        <section className="hidden lg:flex lg:flex-col lg:gap-8">
          <header className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-primary shadow-sm">
              <img src={logo} alt="" aria-hidden="true" className="h-7 w-7" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-primary">
                AgroScope
              </p>
              <h1 className="text-3xl font-semibold tracking-normal text-gray-950">
                Операционный центр хозяйства
              </h1>
            </div>
          </header>

          <div className="space-y-5">
            <p className="max-w-xl text-base leading-7 text-gray-700">
              Цифровой контур КФХ «Тёплый Стан»: поля, календарь работ,
              урожайность и отчеты в одном рабочем пространстве.
            </p>

            <dl className="grid max-w-2xl grid-cols-3 gap-3">
              {FIELD_STATS.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
                  <dt className="text-xs font-medium text-gray-600">{item.label}</dt>
                  <dd className="mt-2 text-xl font-semibold text-gray-950">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="max-w-2xl overflow-hidden rounded-lg shadow-sm">
            <FieldsMiniMap showAction={false} />
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-3rem)] items-center justify-center lg:min-h-0">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-primary shadow-sm">
                <img src={logo} alt="" aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-primary">
                  AgroScope
                </p>
                <h1 className="text-xl font-semibold text-gray-950">Вход в систему</h1>
              </div>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
