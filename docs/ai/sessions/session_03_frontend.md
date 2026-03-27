# Session 03 — Frontend: Фазы 1–5

**Дата:** 2026-03-27
**Инструмент:** Claude Code (claude-sonnet-4-6), VSCode Extension
**Охват:** Фазы 1, 2, 3, 4, 5 из frontend_todo.md

---

## Итог

Реализован полный публичный фронтенд маркетплейса и авторизация в админку.

---

## Фаза 1 — Настройка проекта

**Создано:**
- Vue 3 + TypeScript + Vite (шаблон `vue-ts`)
- vue-router@4, axios
- FSD структура: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`
- `shared/api/http.ts` — axios instance с `baseURL: VITE_API_URL`, интерсептор Bearer токена
- `app/router/index.ts` — роуты + route guard `/admin/*` → `/admin/login`
- Алиас `@` → `src/` в vite.config.ts и tsconfig.app.json
- `.env`, `.env.example` (`VITE_API_URL=http://localhost:8000`)
- `Dockerfile` (multi-stage: node build → nginx) + `nginx.conf`

**Нюанс:** `npm create vite` не работает в непустой директории — создали в `tmp-vite/`, скопировали в корень.

---

## Фаза 2 — Entities и shared

**Создано:**
- `entities/product/model/types.ts`:
  - `Product` — карточка каталога
  - `ProductDetail extends Product` — детализация
  - `ProductAttribute` — пара `{name, value}`
  - `Offer` — оффер с вложенным `Seller`
  - `Seller` — `{id, name, rating}`
  - `ProductsResponse` — `{items, has_more}`
- `entities/product/api/productApi.ts`:
  - `getProducts(offset: number, limit: number)`
  - `getProduct(id: number)`
- `shared/ui/`: `AppSpinner`, `AppButton` (primary/secondary/danger), `AppBadge` (default/success/warning)
- Public API через `index.ts` на каждом уровне

**API контракт (уточнён с бэкендом):**
- Пагинация: `?offset=N&limit=N`, ответ `{items, has_more}`
- Все поля snake_case

---

## Фаза 3 — Каталог + Infinite Scroll

**Создано:**
- `widgets/product-card/ui/ProductCard.vue` — карточка: фото, название, цена (Intl.NumberFormat), остаток, дата доставки. Клик → `/product/:id`
- `features/infinite-scroll/useInfiniteScroll(sentinel, callback, loading)` — IntersectionObserver + watch(loading) для подгрузки пока sentinel виден
- `pages/catalog/model/useCatalog.ts` — products, loading, hasMore, offset, loadMore()
- `pages/catalog/ui/CatalogPage.vue` — сетка `repeat(5, 1fr)`, спиннер, sentinel, сообщение «Все товары загружены»

**Проблема и решение:**
Infinite scroll сломался после смены сетки на 5 колонок.
Причина: на широких экранах sentinel не уходил из viewport → observer не стрелял повторно.
Решение: `useInfiniteScroll` получает `loading: Ref<boolean>`, `watch(loading)` вызывает callback когда `loading → false` и sentinel ещё виден.

---

## Фаза 4 — Детализация товара

**Создано:**
- `pages/product/model/useProduct(id)` — загрузка `getProduct(id)`, состояния loading/error
- `pages/product/ui/ProductPage.vue`:
  - Кнопка «← Назад» (`router.back()`)
  - Основное изображение (`image_url`)
  - Название, цена (Intl.NumberFormat), остаток, описание
  - Таблица атрибутов (`attributes[]`)
- `widgets/offers-list/ui/OffersTable.vue`:
  - Таблица: продавец, рейтинг (AppBadge c цветом по значению), цена, дата доставки
  - Сортировка по цене / дате — computed, без повторных запросов
  - По умолчанию — сортировка по цене

**Решение:** Детализация как страница `/product/:id`, не модалка — браузерная навигация, шарится URL.

---

## Фаза 5 — Авторизация админки

**Создано:**
- Исправлен ключ токена `admin_token` → `access_token` в `http.ts` и `router/index.ts`
- `features/auth/model/useAuth.ts`:
  - `login(username, password)` — POST `/v1/admin/auth/login`, сохраняет `access_token` в localStorage
  - `logout()` — удаляет токен, router.push('/admin/login')
  - `isAuthenticated` — computed
- `pages/admin/login/ui/LoginPage.vue`:
  - Поля username + password
  - Блокировка кнопки во время запроса
  - Сообщение об ошибке при неверных данных
  - Редирект на `/admin/products` при успехе

**Проблема и решение:**
Поля ввода отображали тёмно-серый текст.
Причина: Chrome переопределяет стили при автозаполнении через `-webkit-autofill`.
Решение: добавлены `background: #fff`, `-webkit-text-fill-color: #111827`, override автозаполнения через `-webkit-box-shadow: inset`.

---

## Стек и принятые решения

| Решение | Выбор | Обоснование |
|---------|-------|-------------|
| HTTP клиент | axios | Интерсепторы удобнее для Bearer токена |
| Роутер | Добавлен в Фазе 1 | Нужен с самого начала |
| Детализация товара | Страница `/product/:id` | Браузерная навигация, шарится URL |
| Токен | localStorage `access_token` | Простота, совместимость с axios интерсептором |
| Infinite scroll | IntersectionObserver + watch(loading) | Надёжно работает при любом размере экрана |

---

## Файловая структура после сессии

```
src/
  app/router/index.ts
  pages/
    catalog/model/useCatalog.ts
    catalog/ui/CatalogPage.vue
    product/model/useProduct.ts
    product/ui/ProductPage.vue
    admin/login/ui/LoginPage.vue
  widgets/
    product-card/ui/ProductCard.vue
    offers-list/ui/OffersTable.vue
  features/
    auth/model/useAuth.ts
    infinite-scroll/useInfiniteScroll.ts
  entities/product/
    model/types.ts
    api/productApi.ts
    index.ts
  shared/
    api/http.ts
    ui/{AppSpinner,AppButton,AppBadge}.vue
```
