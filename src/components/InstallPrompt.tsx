"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Smartphone, Gift } from "lucide-react";

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt?: () => void } | null>(null);

  // Слушаем браузерное событие beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt?: () => void });
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Показываем промпт через 3 секунды, если не установлено
  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = sessionStorage.getItem("install_dismissed");
    if (isStandalone || dismissed) return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem("install_dismissed", "1");
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt && deferredPrompt.prompt) {
      deferredPrompt.prompt();
    }
    setVisible(false);
  }, [deferredPrompt]);

  if (!visible) return null;

  return (
    // Тёмный оверлей
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
      onClick={handleDismiss}
    >
      {/* Карточка промпта */}
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl p-6 pb-10"
        style={{
          background: "#ffffff",
          boxShadow: "0 -8px 40px rgba(123,26,46,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Дескриптор (ручка) */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full" style={{ background: "#e5e7eb" }} />
        </div>

        {/* Закрыть */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full"
          style={{ color: "#9ca3af" }}
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        {/* Иконка */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "linear-gradient(135deg, #7b1a2e 0%, #5c1020 100%)",
            boxShadow: "0 4px 16px rgba(123,26,46,0.30)",
          }}
        >
          <Smartphone size={26} color="#f4e49a" />
        </div>

        {/* Заголовок */}
        <h2
          className="text-center font-bold text-xl mb-1"
          style={{ color: "#7b1a2e", fontFamily: "'Georgia', serif" }}
        >
          Установите ТЕАНА
        </h2>
        <p className="text-center text-sm mb-4" style={{ color: "#6b7280" }}>
          на главный экран
        </p>

        {/* Бонус */}
        <div
          className="flex items-center gap-3 rounded-2xl p-4 mb-5"
          style={{ background: "#fdf2f4", border: "1px solid rgba(123,26,46,0.12)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #c9a43d, #e4bc39)" }}
          >
            <Gift size={18} color="#fff" />
          </div>
          <p className="text-sm leading-snug" style={{ color: "#374151" }}>
            Установите приложение на главный экран и получите{" "}
            <strong style={{ color: "#7b1a2e" }}>скидку 100 руб.</strong> на
            следующий заказ!
          </p>
        </div>

        {/* Кнопки */}
        <button
          onClick={handleInstall}
          className="w-full py-3.5 rounded-2xl font-semibold text-base mb-3"
          style={{
            background: "linear-gradient(135deg, #7b1a2e 0%, #5c1020 100%)",
            color: "#f4e49a",
            boxShadow: "0 4px 16px rgba(123,26,46,0.30)",
            letterSpacing: "0.04em",
          }}
        >
          Установить приложение
        </button>

        <button
          onClick={handleDismiss}
          className="w-full py-3 text-sm font-medium"
          style={{ color: "#9ca3af" }}
        >
          Напомнить позже
        </button>
      </div>
    </div>
  );
}
