"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Smartphone, Gift, CheckCircle, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

// ─── Блок "не установлено" ─—
function NotInstalledView({ onEmulate }: { onEmulate: () => void }) {
  return (
    <div className="flex flex-col items-center">
      {/* Иллюстрация */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, #fdf2f4 0%, #fbe8ec 100%)",
          border: "2px dashed rgba(123,26,46,0.20)",
        }}
      >
        <Smartphone size={40} style={{ color: "#7b1a2e", opacity: 0.5 }} />
      </div>

      <h2
        className="text-xl font-bold text-center mb-3"
        style={{ color: "#7b1a2e", fontFamily: "'Georgia', serif" }}
      >
        Откройте доступ к QR-коду
      </h2>

      <p
        className="px-5 text-center text-sm leading-relaxed mb-8"
        style={{ color: "#6b7280", maxWidth: "280px" }}
      >
        Добавьте приложение на главный экран, чтобы получить{" "}
        <strong style={{ color: "#7b1a2e" }}>QR-код на скидку 100 ₽</strong> на следующий
        заказ!
      </p>

      {/* Шаги установки */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9ca3af" }}>
          Как установить
        </p>
        {[
          { n: 1, text: 'Нажмите кнопку "Поделиться" в браузере' },
          { n: 2, text: '"На экран Домой" (iOS) или "Установить" (Android)' },
          { n: 3, text: "Откройте приложение с главного экрана" },
        ].map((step) => (
          <div key={step.n} className="flex items-start gap-3 mb-2.5 last:mb-0">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{ background: "#7b1a2e", color: "#f4e49a" }}
            >
              {step.n}
            </div>
            <p className="text-sm pt-0.5" style={{ color: "#374151" }}>
              {step.text}
            </p>
          </div>
        ))}
      </div>

      {/* Кнопка эмуляции (демо-режим) */}
      <button
        onClick={onEmulate}
        className="w-fit min-w-[220px] mx-auto px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm shadow-md transition-transform active:scale-95"
        style={{
          background: "rgba(123,26,46,0.08)",
          color: "#7b1a2e",
          border: "1px solid rgba(123,26,46,0.20)",
        }}
      >
        <ToggleLeft size={18} />
        Эмулировать PWA (демо)
      </button>

      <p className="text-xs" style={{ color: "#d1d5db" }}>
        Для демонстрации прототипа
      </p>
    </div>
  );
}

// ─── Блок "установлено" с QR-кодом ─—
function InstalledView({
  isEmulated,
  onDeemulate,
}: {
  isEmulated: boolean;
  onDeemulate: () => void;
}) {
  // Уникальный код скидки (в реальном приложении — из БД пользователя)
  const discountCode = "TEANA-PWA-100";

  return (
    <div className="flex flex-col items-center">
      {/* Бейдж статуса */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full mb-6"
        style={{
          background: "rgba(90,122,30,0.10)",
          border: "1px solid rgba(90,122,30,0.25)",
        }}
      >
        <CheckCircle size={15} style={{ color: "#5a7a1e" }} />
        <span className="text-xs font-semibold" style={{ color: "#5a7a1e" }}>
          Приложение установлено
        </span>
        {isEmulated && (
          <span className="text-xs" style={{ color: "#9ca3af" }}>
            (демо)
          </span>
        )}
      </div>

      {/* Заголовок */}
      <h2
        className="text-xl font-bold text-center mb-1"
        style={{ color: "#7b1a2e", fontFamily: "'Georgia', serif" }}
      >
        Ваш QR-код
      </h2>
      <p className="text-sm text-center mb-6" style={{ color: "#6b7280" }}>
        Покажи QR-код на кассе и получи скидку
      </p>

      {/* Карточка с QR */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        {/* QR-код */}
        <div className="flex justify-center mb-5">
          <div
            className="p-4 rounded-2xl"
            style={{ background: "#fafaf8", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <QRCode
              value={`https://teana.shop/discount/${discountCode}`}
              size={180}
              fgColor="#7b1a2e"
              bgColor="#fafaf8"
              level="M"
            />
          </div>
        </div>

        {/* Код скидки */}
        <div
          className="text-center py-3 px-4 rounded-2xl mb-4"
          style={{ background: "#fdf2f4" }}
        >
          <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>
            Промо-код
          </p>
          <p
            className="font-bold text-lg tracking-widest"
            style={{ color: "#7b1a2e" }}
          >
            {discountCode}
          </p>
        </div>

        {/* Размер скидки */}
        <div
          className="flex items-center justify-center gap-3 py-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #c9a43d 0%, #e4bc39 100%)",
          }}
        >
          <Gift size={22} color="#3a1a08" />
          <div className="text-center">
            <p
              className="font-bold text-3xl leading-none"
              style={{ color: "#3a1a08" }}
            >
              −100 ₽
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(58,26,8,0.65)" }}>
              на следующий заказ
            </p>
          </div>
        </div>
      </div>

      {/* Подсказка */}
      <div className="flex items-start gap-3 mt-4 w-full bg-neutral-50 rounded-2xl p-3">
        <Sparkles size={16} style={{ color: "#5a7a1e", marginTop: "2px" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#3d5e14" }}>
          Покажите экран продавцу при оплате. Скидка применяется к заказу от 500 ₽.
        </p>
      </div>

      {/* Кнопка выхода из демо */}
      {isEmulated && (
        <button
          onClick={onDeemulate}
          className="w-fit min-w-[220px] mx-auto px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-transform active:scale-95"
          style={{
            background: "rgba(123,26,46,0.08)",
            color: "#7b1a2e",
            border: "1px solid rgba(123,26,46,0.20)",
          }}
        >
          <ToggleRight size={17} />
          Выйти из демо-режима
        </button>
      )}
    </div>
  );
}

// ─── Страница профиля ─—
export default function ProfilePage() {
  const [isPWA, setIsPWA] = useState(false);
  const [isEmulated, setIsEmulated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsPWA(standalone);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm" style={{ color: "#9ca3af" }}>
          Загрузка…
        </div>
      </div>
    );
  }

  const showQR = isPWA || isEmulated;

  return (
    <main className="px-5 py-6 pb-28 flex flex-col gap-6">
      {showQR ? (
        <InstalledView
          isEmulated={isEmulated}
          onDeemulate={() => setIsEmulated(false)}
        />
      ) : (
        <NotInstalledView onEmulate={() => setIsEmulated(true)} />
      )}
    </main>
  );
}