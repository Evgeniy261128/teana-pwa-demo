"use client";

import { useRouter } from "next/navigation";
import { Thermometer, Clock, Leaf, BookOpen } from "lucide-react";


// ─── Моковые данные ─—
const TEAS = [
  {
    id: "shu-puer",
    name: "Шу Пуэр",
    subtitle: "Классический выдержанный",
    origin: "Юньнань, Китай",
    price: 890,
    weight: "100 г",
    temp: "95–100°C",
    time: "3–5 мин",
    grade: "Премиум",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
    accentColor: "#c9a43d",
    desc: "Глубокий земляной вкус с нотками сухофруктов и шоколада. Идеален для медитативного чаепития.",
  },
  {
    id: "da-hong-pao",
    name: "Да Хун Пао",
    subtitle: "Большой красный халат",
    origin: "Уишань, Фуцзянь",
    price: 1290,
    weight: "50 г",
    temp: "90–95°C",
    time: "2–3 мин",
    grade: "Топ-грейд",
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=800",
    accentColor: "#e4bc39",
    desc: "Легендарный улун с нотками жжёного сахара, орехов и цветочного мёда.",
  },
  {
    id: "tie-guan-yin",
    name: "Те Гуань Инь",
    subtitle: "Железная богиня милосердия",
    origin: "Аньси, Фуцзянь",
    price: 750,
    weight: "100 г",
    temp: "85–90°C",
    time: "2–3 мин",
    grade: "Высший сорт",
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8c011?auto=format&fit=crop&q=80&w=800",
    accentColor: "#7aae48",
    desc: "Нежный цветочный аромат с молочными нотками. Освежающее послевкусие.",
  },
  {
    id: "longjing",
    name: "Лунцзин",
    subtitle: "Колодец дракона",
    origin: "Ханчжоу, Чжэцзян",
    price: 980,
    weight: "50 г",
    temp: "75–80°C",
    time: "1–2 мин",
    grade: "Первый сбор",
    image: "https://images.unsplash.com/photo-1627490022132-45e054170311?auto=format&fit=crop&q=80&w=800",
    accentColor: "#c9a43d",
    desc: "Знаменитый зелёный чай с каштановым ароматом и сладковатым послевкусием.",
  },
];

// ─── Карточка чая ─—
function TeaCard({ tea, onRecipe }: { tea: typeof TEAS[0]; onRecipe: () => void }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
      {/* Фото */}
      <div
        className="w-full h-48 cursor-pointer overflow-hidden"
        onClick={() => router.push(`/recipes?tea=${tea.id}`)}
      >
        <img
          src={tea.image}
          alt={tea.name}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Внутренний контейнер с отступами для ВСЕГО текста и кнопок */}
      <div className="p-4 flex flex-col gap-3">
        {/* Заголовок и описание */}
        <div>
          <h3 className="text-xl font-bold text-neutral-900">
            {tea.name}
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            {tea.subtitle}
          </p>
        </div>

        {/* Описание */}
        <p className="text-sm leading-relaxed text-neutral-500">
          {tea.desc}
        </p>

        {/* Параметры заваривания */}
        <div className="flex flex-row flex-wrap gap-3 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-xl">
          <span>🌡 {tea.temp}</span>
          <span>⏱ {tea.time}</span>
          <span>🍃 {tea.weight}</span>
        </div>

        {/* Цена и кнопка (Нижняя строка) */}
        <div className="flex flex-row justify-between items-center mt-2">
          <span className="text-lg font-bold text-neutral-900">
            {tea.price.toLocaleString("ru-RU")} ₽{" "}
            <span className="text-sm font-normal text-neutral-500">
              / {tea.weight}
            </span>
          </span>
          <button
            onClick={onRecipe}
            className="px-5 py-2.5 bg-rose-900 text-white rounded-xl shadow-md transition-transform active:scale-95 text-sm font-medium w-auto"
          >
            <BookOpen size={14} strokeWidth={2} />
            Как заваривать
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Страница каталога ─—
export default function CatalogPage() {
  const router = useRouter();

  return (
    <main className="px-5 py-6 pb-24 flex flex-col gap-6">
      {/* Заголовок секции */}
      <div className="px-5">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: "linear-gradient(to bottom, #7b1a2e, #c9a43d)" }}
          />
          <h1
            className="text-xl font-bold"
            style={{ color: "#1a1a1a", fontFamily: "'Georgia', serif" }}
          >
            Весь ассортимент
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: "#9ca3af" }}>
          {TEAS.length} сорта в наличии
        </p>
      </div>

      {/* Список карточек */}
      <div className="flex flex-col gap-6">
        {TEAS.map((tea) => (
          <TeaCard
            key={tea.id}
            tea={tea}
            onRecipe={() => router.push(`/recipes?tea=${tea.id}`)}
          />
        ))}
      </div>

      <p className="text-center text-xs" style={{ color: "#d1d5db" }}>
        ✦ Все чаи проходят ручной отбор ✦
      </p>
    </main>
  );
}