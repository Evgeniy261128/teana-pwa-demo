"use client";

import { usePathname } from "next/navigation";

// Декоративный SVG-орнамент в стиле логотипа ТЕАНА
function TeanaOrnament() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      className="opacity-60"
    >
      <path
        d="M8 0C5 0 2 2 0 5c2 3 5 5 8 5s6-2 8-5C14 2 11 0 8 0z"
        fill="currentColor"
        opacity="0.3"
      />
      <path d="M8 2C6 2 4 3.5 3 5c1 1.5 3 3 5 3s4-1.5 5-3C12 3.5 10 2 8 2z" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/catalog":  "Каталог чая",
  "/recipes":  "Рецепты заваривания",
  "/contacts": "Контакты",
  "/profile":  "Мой профиль",
};

export default function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "ТЕАНА";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #7b1a2e 0%, #5c1020 100%)",
        boxShadow: "0 2px 20px rgba(123,26,46,0.25)",
        height: "64px",
      }}
    >
      <div className="flex flex-col items-center gap-0.5">
        {/* Логотип ТЕАНА */}
        <div className="flex items-center gap-1.5">
          {/* Чайный лист */}
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <path
              d="M7 1C7 1 2 5 2 10a5 5 0 0010 0C12 5 7 1 7 1z"
              fill="#5a7a1e"
            />
            <path
              d="M7 6C7 6 4 9 4 12a3 3 0 006 0C10 9 7 6 7 6z"
              fill="#7aae48"
            />
            <line x1="7" y1="7" x2="7" y2="17" stroke="#5a7a1e" strokeWidth="0.8"/>
          </svg>

          <span
            className="font-bold tracking-[0.25em] uppercase"
            style={{
              fontSize: "22px",
              color: "#f4e49a",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              fontFamily: "'Georgia', serif",
            }}
          >
            ТЕАНА
          </span>
        </div>

        {/* Подзаголовок страницы */}
        {pathname !== "/" && (
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(244,228,154,0.65)", fontSize: "9px" }}
          >
            {title}
          </span>
        )}
      </div>
    </header>
  );
}
