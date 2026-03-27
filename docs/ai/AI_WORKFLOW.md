# AI Workflow — marketplace-frontend

Документирует все AI-сессии по разработке фронтенда.
Инструмент: **Claude Code (claude-sonnet-4-6)**, интерактивный режим через VSCode Extension.

---

## Формат записи сессий

- **Фаза** — к какой фазе из frontend_todo.md относится
- **Инструмент** — модель и режим работы
- **Итерации** — сколько раундов правок потребовалось
- **Проблемы** — что пошло не так
- **Решения** — как было исправлено

---

## Фаза 1 — Настройка проекта

**Дата:** 2026-03-27
**Инструмент:** Claude Code, claude-sonnet-4-6
**Итерации:** 1

**Что сделано:**
- Создан Vue 3 + TypeScript + Vite проект
- Настроена FSD структура (app, pages, widgets, features, entities, shared)
- Установлены vue-router@4 и axios
- Настроен алиас `@` → `src/` в vite.config.ts и tsconfig.app.json
- Создан shared/api/http.ts — axios с интерсептором Bearer токена
- Создан app/router/index.ts — роутер с route guard для /admin/*
- Созданы .env, .env.example, Dockerfile, nginx.conf
- Созданы заглушки для всех страниц

**Проблемы:** `npm create vite` отказывался работать в непустой директории (там был frontend_todo.md).
**Решение:** Создали проект во временной папке `tmp-vite`, затем скопировали в корень.

**Результат:** `npm run dev` запускается, браузер открывает страницу, консоль чистая.

---

## Фаза 2 — Entities и shared

**Дата:** 2026-03-27
**Инструмент:** Claude Code, claude-sonnet-4-6
**Итерации:** 1

**Что сделано:**
- `entities/product/model/types.ts` — типы Product, ProductDetail, ProductAttribute, Offer, Seller, ProductsResponse
- `entities/product/api/productApi.ts` — getProducts(offset, limit), getProduct(id)
- `shared/ui` — AppSpinner, AppButton (primary/secondary/danger), AppBadge (default/success/warning)
- Public API (index.ts) для каждого слайса по FSD

**Уточнения по API (получены от разработчика бэкенда):**
- Пагинация: `offset/limit` (не `page`), ответ содержит `has_more`
- Все поля snake_case
- Структура Offer вложена в ProductDetail

**Проблем не было.** Сборка чистая с первого раза.

---

## Фаза 3 — Главная страница (каталог)

**Дата:** 2026-03-27
**Инструмент:** Claude Code, claude-sonnet-4-6
**Итерации:** 2

**Что сделано:**
- `widgets/product-card/ui/ProductCard.vue` — карточка с hover-эффектом, цена через Intl.NumberFormat
- `features/infinite-scroll/useInfiniteScroll.ts` — composable на IntersectionObserver
- `pages/catalog/model/useCatalog.ts` — стейт каталога (products, loading, hasMore, offset)
- `pages/catalog/ui/CatalogPage.vue` — сетка 5 колонок, спиннер, сообщение «Все товары загружены»

**Проблема:** После смены сетки на `repeat(5, 1fr)` infinite scroll перестал работать.
**Причина:** IntersectionObserver стреляет только при *изменении* видимости. На широких экранах sentinel оставался во viewport после загрузки первой порции — повторного триггера не было.
**Решение:** `useInfiniteScroll` расширен параметром `loading: Ref<boolean>`. Добавлен `watch(loading)` — когда загрузка завершается и sentinel всё ещё виден, `loadMore` вызывается снова. Убран дублирующий `onMounted(() => loadMore())`.

**Дополнительно:** Исправлен CORS на бэкенде (добавлен `localhost:5173`).

**Результат:** Каталог открывается, карточки отображаются, infinite scroll работает.

---

## Фаза 4 — Детализация товара

**Дата:** 2026-03-27
**Инструмент:** Claude Code, claude-sonnet-4-6
**Итерации:** 1

**Что сделано:**
- `pages/product/model/useProduct.ts` — загрузка товара по id, состояния loading/error
- `pages/product/ui/ProductPage.vue` — изображение, цена, остаток, описание, таблица атрибутов, кнопка «← Назад»
- `widgets/offers-list/ui/OffersTable.vue` — таблица офферов, сортировка по цене/дате через computed, рейтинг через AppBadge

**Архитектурное решение:** Детализация реализована как отдельная страница `/product/:id`, а не модальное окно — браузерная навигация работает корректно, URL шарится.

**Проблем не было.** Сборка чистая с первого раза.

---

## Фаза 5 — Авторизация админки

**Дата:** 2026-03-27
**Инструмент:** Claude Code, claude-sonnet-4-6
**Итерации:** 2

**Что сделано:**
- Исправлен ключ токена: `admin_token` → `access_token` в http.ts и router/index.ts
- `features/auth/model/useAuth.ts` — login(), logout(), isAuthenticated
- `pages/admin/login/ui/LoginPage.vue` — форма username/password, блокировка кнопки, ошибка

**API контракт:**
- POST `/v1/admin/auth/login` с `{username, password}` → `{access_token, token_type}`
- Токен хранится в `localStorage` под ключом `access_token`

**Проблема:** Поля ввода были тёмно-серыми, текст при вводе плохо виден.
**Причина:** Браузерные дефолты переопределяли цвет текста при автозаполнении (Chrome `-webkit-autofill`).
**Решение:** Добавлены явный `background: #fff`, `-webkit-text-fill-color: #111827`, и `-webkit-autofill` override через box-shadow inset.

**Результат:** Логин работает, неверный пароль показывает ошибку, редирект на `/admin/products` после успешного входа.

---

## Фаза 6 — Управление товарами (Админка)

**Дата:** 2026-03-27
**Инструмент:** Claude Code, claude-sonnet-4-6
**Итерации:** 1

**Что сделано:**
- `entities/product/api/adminApi.ts` — все CRUD функции: товары, изображение, атрибуты, офферы, продавцы
- `pages/admin/products/ui/AdminProductsPage.vue` — таблица товаров с кнопками
- `pages/admin/products/ui/ProductFormModal.vue` — создание/редактирование товара
- `pages/admin/products/ui/OfferFormModal.vue` — управление офферами товара

**Архитектурное решение:** Формы реализованы как модальные окна (не отдельные страницы) — не нужен дополнительный роутинг, проще состояние.

**Детали реализации:**
- При создании товара: сначала POST базовых полей, затем PUT атрибутов (если есть), затем POST изображения (если выбрано)
- При редактировании: один PUT со всеми полями включая attributes
- OfferFormModal загружает офферы и список продавцов параллельно через Promise.all
- Inline редактирование оффера: кнопка ✎ заполняет форму, кнопка «Отмена» сбрасывает

**Проблем не было.** Сборка чистая с первого раза.

---

## Фаза 7 — Финальная проверка

**Дата:** 2026-03-27
**Инструмент:** Claude Code, claude-sonnet-4-6
**Итерации:** 1

**Что сделано:**
- Адаптивность каталога: `repeat(5,1fr)` → 5 колонок на desktop, 3 на планшете (≤1024px), 2 на мобильном (≤768px)
- Адаптивность детализации: двухколоночный layout `380px 1fr` → одноколоночный на мобильном (≤768px), уменьшены размеры шрифтов
- OffersTable: `overflow-x: auto` + `min-width: 480px` — таблица скроллится горизонтально на мобильном
- Админка: шапка и поиск переходят в вертикальный стек на мобильном, таблица скроллится, кнопки действий выстраиваются в колонку
- Проверка импортов: grep по всем файлам — нарушений FSD public API нет

**Проблем не было.** Сборка чистая с первого раза.

---

## Итоговая статистика

| Фаза | Итерации | Проблемы |
|------|----------|----------|
| 1 — Настройка | 1 | vite в непустой директории |
| 2 — Entities | 1 | — |
| 3 — Каталог | 2 | IntersectionObserver + CORS |
| 4 — Детализация | 1 | — |
| 5 — Авторизация | 2 | ключ токена + стили инпутов |
| 6 — Админка | 3 | рефетч после сохранения, атрибуты null, thumbnail null |
| 7 — Финальная | 1 | — |
