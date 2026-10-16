import Link from "next/link";

// Декоративный лист SVG
function LeafIcon({ size = 24, color = "#5a7a1e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 24 31" fill="none">
      <path
        d="M12 0C12 0 3 7 3 17a9 9 0 0018 0C21 7 12 0 12 0z"
        fill={color}
        opacity={0.85}
      />
      <path
        d="M12 6C12 6 7 12 7 18a5 5 0 0010 0C17 12 12 6 12 6z"
        fill={color}
        opacity={0.6}
      />
      <line x1="12" y1="8" x2="12" y2="30" stroke={color} strokeWidth="1" opacity={0.5}/>
    </svg>
  );
}

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #7b1a2e 0%, #4a0e1c 40%, #1a0508 100%)",
      }}
    >
      {/* Декоративные круги-блики */}
      <div
        className="absolute top-[-80px] right-[-60px] w-64 h-64 rounded-full"
        style={{ background: "rgba(201,164,61,0.08)", filter: "blur(40px)" }}
      />
      <div
        className="absolute bottom-40 left-[-80px] w-80 h-80 rounded-full"
        style={{ background: "rgba(90,122,30,0.10)", filter: "blur(60px)" }}
      />

      {/* Верхняя часть — логотип */}
      <div className="flex flex-col items-center pt-20 px-6 flex-1 justify-center z-10">
        {/* Логотип */}
        <div className="mb-6 flex items-end gap-2">
          <LeafIcon size={36} color="#7aae48" />
          <div className="flex flex-col">
            <span
              className="font-bold tracking-[0.3em] leading-none"
              style={{
                fontSize: "48px",
                color: "#f4e49a",
                fontFamily: "'Georgia', serif",
                textShadow: "0 2px 20px rgba(201,164,61,0.4)",
              }}
            >
              ТЕАНА
            </span>
            <span
              className="tracking-[0.2em] text-xs uppercase"
              style={{ color: "rgba(244,228,154,0.55)" }}
            >
              Магазин редкого чая
            </span>
          </div>
        </div>

        {/* Декоративная линия с орнаментом */}
        <div className="flex items-center gap-3 mb-10 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ background: "rgba(201,164,61,0.3)" }} />
          <span style={{ color: "rgba(201,164,61,0.5)", fontSize: "18px" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "rgba(201,164,61,0.3)" }} />
        </div>

        {/* Tagline */}
        <p
          className="text-center text-base leading-relaxed mb-12 max-w-xs"
          style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}
        >
          Откройте мир изысканных сортов китайского чая. 
          Пуэры, улуны, зелёные чаи — прямо из Юньнани.
        </p>

        {/* CTA кнопка */}
        <Link
          href="/catalog"
          className="flex items-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base"
          style={{
            background: "linear-gradient(135deg, #c9a43d 0%, #e4bc39 100%)",
            color: "#3a1a08",
            boxShadow: "0 6px 28px rgba(201,164,61,0.40)",
            letterSpacing: "0.05em",
          }}
        >
          <LeafIcon size={16} color="#3a1a08" />
          Смотреть каталог
        </Link>

        {/* Дополнительные ссылки */}
        <div className="flex gap-6 mt-8">
          <Link
            href="/recipes"
            className="text-sm"
            style={{ color: "rgba(244,228,154,0.65)" }}
          >
            Рецепты
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <Link
            href="/contacts"
            className="text-sm"
            style={{ color: "rgba(244,228,154,0.65)" }}
          >
            Контакты
          </Link>
        </div>
      </div>

      {/* Нижняя часть */}
      <div className="w-full px-6 pb-10 z-10">
        {/* Блок с бонусом */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(201,164,61,0.20)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(201,164,61,0.15)" }}
          >
            <span style={{ fontSize: "20px" }}>🎁</span>
          </div>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: "#f4e49a" }}>
              Скидка 100 ₽ новым покупателям
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Установите приложение на главный экран
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
