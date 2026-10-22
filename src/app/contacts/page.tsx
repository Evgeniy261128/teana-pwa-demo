import { Phone, MapPin, Clock, User } from "lucide-react";

// ─── Интерактивная карта Яндекс.Карт ─—
function YandexMap() {
  return (
    <div className="relative">
      <iframe
        src="https://yandex.ru/map-widget/v1/?ll=29.967537%2C60.096336&z=16&text=%D0%A1%D0%B5%D1%81%D1%82%D1%80%D0%BE%D1%80%D0%B5%D1%86%D0%BA%2C+%D0%9E%27%D0%9A%D0%95%D0%99"
        width="100%"
        height="250"
        frameBorder="0"
        title="Карта: г. Сестрорецк, гипермаркет О'КЕЙ"
        allowFullScreen
        className="rounded-xl shadow-inner mt-4 w-full h-auto"
        style={{ border: 0 }}
      />
      {/* Fallback для офлайн-режима */}
      <noscript>
        <div
          className="absolute inset-0 flex items-center justify-center text-sm rounded-xl"
          style={{ background: "#f3f4f6", color: "#6b7280" }}
        >
          Карта недоступна без подключения к интернету
        </div>
      </noscript>
    </div>
  );
}

// ─── Строка контакта ─—
function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: "linear-gradient(135deg, #7b1a2e, #5c1020)",
          boxShadow: "0 2px 8px rgba(123,26,46,0.22)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: "#9ca3af" }}>{label}</p>
        <p className="text-sm font-medium leading-snug whitespace-pre-line" style={{ color: "#1a1a1a" }}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Страница контактов ─—
export default function ContactsPage() {
  return (
    <main className="px-5 py-6 pb-28 flex flex-col gap-6">
      {/* Заголовок */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: "linear-gradient(to bottom, #7b1a2e, #c9a43d)" }}
          />
          <h1
            className="text-xl font-bold"
            style={{ color: "#1a1a1a", fontFamily: "'Georgia', serif" }}
          >
            Как нас найти
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: "#9ca3af" }}>
          Рады каждому гостю
        </p>
      </div>

      {/* Карточка магазина */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        {/* Шапка */}
        <div
          className="px-5 py-5"
          style={{ background: "linear-gradient(135deg, #7b1a2e 0%, #5c1020 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(244,228,154,0.12)",
                border: "1.5px solid rgba(244,228,154,0.25)",
              }}
            >
              <User size={26} color="#f4e49a" />
            </div>
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: "#f4e49a", fontFamily: "'Georgia', serif" }}
              >
                Анна
              </h2>
              <p className="text-sm" style={{ color: "rgba(244,228,154,0.60)" }}>
                Хозяйка магазина ТЕАНА
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#7aae48", boxShadow: "0 0 5px #7aae48" }}
                />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Открыто сейчас
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Контактные строки */}
        <div className="p-6 flex flex-col gap-5 divide-y divide-neutral-100">
          <ContactRow
            icon={<Phone size={16} color="#f4e49a" />}
            label="Телефон / WhatsApp"
            value="+7 (999) 123-45-67"
            href="tel:+79991234567"
          />
          <ContactRow
            icon={<MapPin size={16} color="#f4e49a" />}
            label="Адрес"
            value={"г. Сестрорецк, гипермаркет «О'КЕЙ»\nОстровок на выходе из торгового зала"}
          />
          <ContactRow
            icon={<Clock size={16} color="#f4e49a" />}
            label="Время работы"
            value={"Пн–Пт: 10:00 – 21:00\nСб–Вс: 10:00 – 22:00"}
          />
        </div>

        {/* Карта Яндекс */}
        <div className="p-4 pt-2">
          <YandexMap />
        </div>
      </div>

      {/* Кнопка звонка */}
      <a
        href="tel:+79991234567"
        className="w-fit min-w-[220px] mx-auto px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-base shadow-md transition-transform active:scale-95"
        style={{
          background: "linear-gradient(135deg, #7b1a2e 0%, #5c1020 100%)",
          color: "#f4e49a",
          boxShadow: "0 4px 16px rgba(123,26,46,0.28)",
          letterSpacing: "0.03em",
        }}
      >
        <Phone size={17} />
        Позвонить Анне
      </a>

      <p className="text-center text-xs" style={{ color: "#d1d5db" }}>
        ✦ Рады ответить на любые вопросы о чае ✦
      </p>
    </main>
  );
}