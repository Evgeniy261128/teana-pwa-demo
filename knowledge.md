# knowledge.md — контекст проекта «ТЕАНА» (tea-shop-mvp)

> Выжимка архитектуры, структуры и правил кода. Обновлять при изменениях в проекте.
> Обязательные правила разработки — в `AI_DEVELOPMENT_RULES.md.txt`, описание продукта — в `README.md.txt`.

## 1. Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js **15.3** (App Router, `src/app/`), React **19**, TypeScript 5 (strict) |
| Стили | Tailwind CSS **v4** (`@import "tailwindcss"` + `@source` в `globals.css`, `@theme` с токенами) |
| PWA | `next-pwa` (в `next.config.ts`, `dest: "public"`, отключён в dev) + `public/manifest.json` |
| БД | Supabase (PostgreSQL), `@supabase/supabase-js` v2 — клиент в `src/lib/supabase.ts` |
| Иконки / QR | `lucide-react`, `react-qr-code` |
| Карты | Яндекс.Карты (iframe-виджет на `/contacts`) |
| Линт | ESLint 9 + `eslint-config-next` (`next/core-web-vitals`), `npm run lint` |
| Alias | `@/*` → `./src/*` |

Команды: `npm install` → `npm run dev` (localhost:3000) / `npm run build` / `npm run lint`.
Env: `.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_DB_PASSWORD`. Файл в `.gitignore`, `.env.example` в репо отсутствует.

## 2. Архитектура: SEO-лендинг + PWA

- `/` — десктопный/мобильный **SEO-лендинг** (без Header/BottomNav, только CTA).
- PWA начинается с `/catalog`; в `manifest.json` `start_url = "/catalog"` (строго).
- Оболочка — `src/components/AppShell.tsx` (обёрнута в `layout.tsx` вокруг `{children}`): рисует «телефон» (max-w-md, скругления на десктопе), `Header` (fixed, 64px), `BottomNav` (fixed, 4 вкладки), `InstallPrompt`. Header/BottomNav скрываются на `/`.
- Bottom Tab Bar: `/catalog` · `/recipes` · `/contacts` · `/profile`.

## 3. Структура папок

```
├── public/
│   └── manifest.json          # PWA-манифест (иконки /icons/* ПОКА ОТСУТСТВУЮТ)
├── supabase/
│   └── migrations/001_initial_schema.sql   # единственный миграшник (схема + RLS + seed)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # html lang=ru, шрифт Inter, metadata, viewport, AppShell
│   │   ├── page.tsx           # SEO-лендинг (Server Component)
│   │   ├── globals.css        # Tailwind v4 + токены burgundy/gold/tea + сброс
│   │   ├── catalog/page.tsx   # каталог (client, МОК-данные)
│   │   ├── recipes/page.tsx   # рецепты (client, МОК, Suspense для useSearchParams)
│   │   ├── contacts/page.tsx  # контакты + Яндекс.Карта (Server Component)
│   │   └── profile/page.tsx   # QR-код на скидку (client, PWA standalone / демо-эмуляция)
│   ├── components/
│   │   ├── AppShell.tsx  ├── Header.tsx  ├── BottomNav.tsx  └── InstallPrompt.tsx
│   ├── hooks/            # пусто (.gitkeep) — хуки пока не выносятся
│   └── lib/supabase.ts   # экспорт supabase-клиента (СЕЙЧАС НИКЕМ НЕ ИСПОЛЬЗУЕТСЯ)
├── AI_DEVELOPMENT_RULES.md.txt   # обязательные правила для AI
├── README.md.txt                 # описание продукта и план V2
└── next.config.ts                # next-pwa + remotePatterns: images.unsplash.com
```

## 4. Состояние данных (важно!)

- **UI сейчас работает полностью на мок-данных**, захардкоженных прямо в страницах:
  - `catalog/page.tsx` → массив `TEAS` (4 чая, id вида `shu-puer`);
  - `recipes/page.tsx` → массив `RECIPES` (4 рецепта, те же id);
  - `contacts/page.tsx` → адрес/телефон/часы прописаны строками (Сестрорецк, «О'КЕЙ»);
  - `profile/page.tsx` → промо-код `"TEANA-PWA-100"` захардкожен, QR рендерится локально.
- **`src/lib/supabase.ts` нигде не импортируется** — подключение к БД на фронте не сделано.
- Расхождение моков и БД: в миграции **5** товаров с другими slug/ценами (`shu-puer-klassicheskiy`, 650 ₽) и адресом в **Москве**, в коде — 4 чая и Сестрорецк. Сверить перед подключением.

## 5. База данных (Supabase) — `supabase/migrations/001_initial_schema.sql`

Расширения: `pgcrypto`, `pg_trgm`.

| Таблица | Назначение | RLS |
|---|---|---|
| `public.users` | профиль клиента, привязан к `auth.users` (`id` FK), `bonus_points`, `qr_code_hash UUID` | SELECT/UPDATE только владелец (`auth.uid() = id`); INSERT — только через триггер |
| `public.tea_products` | каталог: `slug` (unique), `category`, `effect`, `price`, `stock_quantity`, `water_temp`, `brewing_time_sec`, `grams_per_100ml`, SEO-`meta_*` | публичное чтение (`anon, authenticated`), запись с клиента запрещена |
| `public.store_contacts` | адрес, телефон, часы, `social_links JSONB` | публичное чтение, запись запрещена |

Триггеры: `set_updated_at()` (users, store_contacts), `handle_new_user()` — автосоздание строки `public.users` при регистрации (SECURITY DEFINER, `search_path = public`, идемпотентен).
Индексы: `slug` unique, `category`, `effect`, `is_available`, GIN trgm по `name`, `users.phone`.
Seed: 5 чаёв + 1 запись контактов магазина.

**Правило:** любое изменение структуры — только новым SQL-файлом в `supabase/migrations/`, с RLS-политиками для каждой новой таблицы; не править схему через Dashboard в обход миграций.
**Расхождение:** README требует таблицу «заявок на скидку» (анонимная запись / чтение только админами) — **такой таблицы в схеме пока нет**.

## 6. UI/UX и дизайн-система

- Токены в `globals.css` (`@theme`): `burgundy` (основной `#7b1a2e`), `gold` (`#c9a43d`), `tea` (`#5a7a1e`), `cream/surface/muted`.
- Но в компонентах часто используются **inline `style={{...}}`** с теми же hex-значениями, а не Tailwind-токены (`bg-rose-900` в кнопках — не из палитры). Дублирование цветов — кандидат на вычистку.
- Шрифт заголовков — `'Georgia', serif` (inline), body — Inter.
- Mobile-first; на десктопе всё свёрнуто в «телефон» max-w-md.
- Обязательно обрабатывать 3 состояния у сетевых компонентов: `isLoading` / `isError` / `isEmpty` (сейчас негде применять — данные моковые).
- JSON-LD (Product / Article / LocalBusiness) и per-page `metadata` — **пока не реализованы** (метаданные только в `layout.tsx`).

## 7. PWA

- `manifest.json`: `start_url: /catalog`, `display: standalone`, `theme_color: #4a7c59` (⚠ расходится с `themeColor: #7b1a2e` в `layout.tsx`), иконки `/icons/icon-192x192.png`, `/icons/icon-512x512.png` — **файлов в `public/` нет**.
- Service worker генерируется `next-pwa` в `public/` (sw.js, workbox-*.js) — в `.gitignore`, в dev отключён.
- `InstallPrompt` слушает `beforeinstallprompt`, показывается через 3 c, закрытие запоминается в `sessionStorage.install_dismissed`.
- `profile/page.tsx` определяет установку по `matchMedia("(display-mode: standalone)")` + кнопка «Эмулировать PWA (демо)».

## 8. Правила кода (кратко, из AI_DEVELOPMENT_RULES)

1. Перед изменением изучать `/src/components` и `/src/hooks`, не создавать дубликаты.
2. Не менять публичные интерфейсы, архитектуру БД и роутинг без согласования.
3. Удаляемое старое кодировать комментарием-обоснованием в ответе.
4. Принцип малых шагов: UI → подключение БД → логика состояний.
5. Миграции обязательны, RLS обязателен.
6. Mobile-first, 3 состояния сети, JSON-LD, офлайн-fallback (карта/данные) в PWA.
7. Формат ответа: сначала список затронутых файлов, потом возможные побочные эффекты; при нехватке данных — остановиться и задать вопрос, не выдумывать бизнес-правила.

## 9. Известные проблемы / TODO (на момент создания файла)

- [ ] Каталог, рецепты, контакты не читают Supabase — только моки; `lib/supabase.ts` не подключён.
- [ ] Расхождение моков и seed-данных (slug, цены, адрес).
- [ ] Нет иконок PWA в `public/icons/`, расхождение `theme_color`.
- [ ] Нет страницы товара (`/catalog/[slug]`) и JSON-LD.
- [ ] Нет таблицы заявок на скидку и панели продавца (скан QR + валидация).
- [ ] Нет авторизации/регистрации на фронте, хотя схема рассчитана на `auth.users`.
- [ ] `catalog` использует `<img>` вместо `next/image` (lint warning), есть неиспользуемые импорты (`Thermometer`, `Clock`, `Leaf`, `Droplets`).
- [ ] Фиксированный `Header`/`BottomNav` позиционируются относительно вьюпорта, а не контейнера-«телефона» — на десктопе растягиваются на всю ширину.
- [ ] `noscript`-fallback карты не срабатывает при отсутствии сети (нужен JS-фолбэк).
- [ ] Типизация: `TEAS[0]`/`RECIPES[0]` вместо именованного типа, магические hex-цвета вместо токенов.

Проверено: `npx tsc --noEmit` — OK; `npm run lint` — 1 warning (`no-img-element` в `catalog/page.tsx`).
