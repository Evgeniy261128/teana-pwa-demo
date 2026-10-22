"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Thermometer, Clock, Droplets, Leaf, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// ─── Данные рецептов ─—
const RECIPES = [
  {
    id: "shu-puer",
    name: "Шу Пуэр",
    subtitle: "Классический выдержанный",
    gradient: "linear-gradient(135deg, #2d1b0e 0%, #5a3520 100%)",
    emoji: "🍂",
    params: { temp: "95–100°C", leaf: "7–8 г", water: "150 мл", time: "3–5 мин" },
    steps: [
      { n: 1, title: "Прогрев посуды", desc: "Ополосните чайник и пиалы кипятком. Это стабилизирует температуру и раскрывает аромат." },
      { n: 2, title: "Промывка листа", desc: "Засыпьте 7–8 г чая, залейте кипятком на 5 секунд и слейте. Это «пробуждает» лист." },
      { n: 3, title: "Первый пролив", desc: "Залейте водой 95–100°C, закройте крышку на 30 секунд, разлейте по пиалам." },
      { n: 4, title: "Дальнейшие проливы", desc: "Каждый следующий пролив увеличивайте время на 10–15 секунд. Чай раскрывается постепенно." },
      { n: 5, title: "Наслаждайтесь", desc: "Пейте горячим. Обратите внимание на землистые нотки и долгое маслянистое послевкусие." },
    ],
    tips: "💡 Шу Пуэр хранится годами — старый чай ценится выше. Идеален вечером.",
  },
  {
    id: "da-hong-pao",
    name: "Да Хун Пао",
    subtitle: "Большой красный халат",
    gradient: "linear-gradient(135deg, #4a1010 0%, #8b2020 100%)",
    emoji: "🌹",
    params: { temp: "90–95°C", leaf: "6–7 г", water: "120 мл", time: "2–3 мин" },
    steps: [
      { n: 1, title: "Подготовка", desc: "Прогрейте посуду. Для Да Хун Пао идеально подходит исинская глиняная посуда — она усиливает аромат." },
      { n: 2, title: "Засыпка", desc: "Положите 6–7 г чая в чайник. Понюхайте сухой лист — должен чувствоваться аромат карамели и орехов." },
      { n: 3, title: "Первый пролив (15 сек)", desc: "Залейте водой 90–95°C круговым движением. Выдержите 15–20 секунд." },
      { n: 4, title: "Прогрессия", desc: "2-й: 20 сек, 3-й: 25 сек, 4-й: 35 сек. Вкус меняется с каждым проливом." },
      { n: 5, title: "Дегустация", desc: "Ощутите минеральность, жжёный сахар и цветочный мёд. Послевкусие длится до 3 минут." },
    ],
    tips: "💡 Не используйте металлическую посуду — она «убивает» тонкий аромат улуна.",
  },
  {
    id: "tie-guan-yin",
    name: "Те Гуань Инь",
    subtitle: "Железная богиня милосердия",
    gradient: "linear-gradient(135deg, #1a3d1a 0%, #2d6b2d 100%)",
    emoji: "🌿",
    params: { temp: "85–90°C", leaf: "5–6 г", water: "150 мл", time: "2–3 мин" },
    steps: [
      { n: 1, title: "Температура воды", desc: "Дайте кипятку остыть до 85–90°C. Перегрев разрушит деликатный цветочный аромат." },
      { n: 2, title: "Прогрев и засыпка", desc: "Прогрейте чайник, засыпьте 5–6 г. Гранулированный лист раскрывается медленно." },
      { n: 3, title: "Первый пролив (45 сек)", desc: "Залейте водой, выдержите 45 секунд. Первый пролив даёт мягкий молочный вкус." },
      { n: 4, title: "Проливы 2–4", desc: "Каждый последующий пролив на 15–20 секунд дольше. Аромат цветов усиливается." },
      { n: 5, title: "Дегустация", desc: "Чай дарит ощущение свежести. Идеален утром вместо кофе." },
    ],
    tips: "💡 Те Гуань Инь прекрасно подходит к лёгким десертам и фруктам.",
  },
  {
    id: "longjing",
    name: "Лунцзин",
    subtitle: "Колодец дракона",
    gradient: "linear-gradient(135deg, #1a2d10 0%, #3d6b1a 100%)",
    emoji: "☘️",
    params: { temp: "75–80°C", leaf: "3–4 г", water: "200 мл", time: "1–2 мин" },
    steps: [
      { n: 1, title: "Низкая температура", desc: "Лунцзин — зелёный чай. Температура строго 75–80°C, иначе чай даст горечь." },
      { n: 2, title: "Посуда", desc: "Используйте стеклянный чайник или гайвань. Любуйтесь, как листья разворачиваются." },
      { n: 3, title: "Засыпка и пролив", desc: "3–4 г на 200 мл воды. Засыпьте лист, залейте на 60–90 секунд." },
      { n: 4, title: "Второй пролив", desc: "Второй пролив: 80 секунд. Вкус насыщается, проявляются ореховые ноты." },
      { n: 5, title: "Наслаждайтесь", desc: "Лунцзин первого сбора (Mingqian) — элитный чай. Цените каждый глоток." },
    ],
    tips: "💡 Первый сбор (до Цинмин) — самый ценный. Хранить в холодильнике.",
  },
];

// ─── Карточка рецепта ─—
function RecipeCard({ recipe, defaultOpen }: { recipe: typeof RECIPES[0]; defaultOpen?: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen ?? false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
      {/* Шапка */}
      <div
        className="h-24 flex flex-col items-center justify-center gap-1"
        style={{ background: recipe.gradient }}
      >
        <span className="text-3xl">{recipe.emoji}</span>
        <h2
          className="font-bold text-base"
          style={{ color: "#f4e49a", fontFamily: "'Georgia', serif" }}
        >
          {recipe.name}
        </h2>
        <p className="text-xs" style={{ color: "rgba(244,228,154,0.60)" }}>
          {recipe.subtitle}
        </p>
      </div>

      {/* Внутренний контейнер с отступами для ВСЕГО текста */}
      <div className="p-4 flex flex-col gap-3">
        {/* Параметры — 2×2 сетка */}
        <div className="flex flex-row flex-wrap gap-3 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-xl">
          <span>🌡 {recipe.params.temp}</span>
          <span>🍃 {recipe.params.leaf}</span>
          <span>💧 {recipe.params.water}</span>
          <span>⏱ {recipe.params.time}</span>
        </div>

        {/* Кнопка раскрытия */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left text-rose-900"
        >
          <span className="font-semibold text-sm">Шаги заваривания</span>
          {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </button>

        {/* Шаги */}
        {expanded && (
          <div className="flex flex-col gap-3">
            {recipe.steps.map((step) => (
              <div key={step.n} className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #7b1a2e, #5c1020)", color: "#f4e49a" }}
                >
                  {step.n}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5 text-neutral-800">
                    {step.title}
                  </p>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Совет */}
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(90,122,30,0.08)", border: "1px solid rgba(90,122,30,0.15)" }}
            >
              <p className="text-xs leading-relaxed" style={{ color: "#3d5e14" }}>
                {recipe.tips}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Внутренний компонент ─—
function RecipesContent() {
  const searchParams = useSearchParams();
  const activeTea = searchParams.get("tea");

  const sorted = activeTea
    ? [...RECIPES].sort((a) => (a.id === activeTea ? -1 : 1))
    : RECIPES;

  return (
    <main className="px-5 py-6 pb-28 flex flex-col gap-6">
      {/* Заголовок секции */}
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
            Рецепты заваривания
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: "#9ca3af" }}>
          Нажмите, чтобы раскрыть шаги
        </p>
      </div>

      {/* Список карточек */}
      <div className="flex flex-col gap-6">
        {sorted.map((recipe, i) => (
          <RecipeCard key={recipe.id} recipe={recipe} defaultOpen={i === 0 && !!activeTea} />
        ))}
      </div>
    </main>
  );
}

// ─── Страница рецептов ─—
export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#9ca3af" }}>
        Загрузка…
      </div>
    }>
      <RecipesContent />
    </Suspense>
  );
}