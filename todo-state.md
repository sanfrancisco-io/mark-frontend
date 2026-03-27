# TODO STATE — marketplace-frontend

## Последняя выполненная задача
Фаза 4 — Детализация товара (2026-03-27)
- pages/product/model/useProduct.ts — загрузка товара по id, состояния loading/error
- pages/product/ui/ProductPage.vue — изображение, описание, атрибуты (таблица), кнопка «Назад»
- widgets/offers-list/ui/OffersTable.vue — таблица офферов, сортировка по цене/дате (computed), рейтинг через AppBadge
- Сборка чистая

## Следующая задача
Фаза 5: Админка (авторизация)
- pages/admin/login — форма логин + пароль
- POST /v1/admin/auth/login → сохранить токен в localStorage
- features/auth — хранение токена, logout
- Роут-гард уже настроен в app/router/index.ts

## Контекст
- стек: Vue 3 + TypeScript + Vite + vue-router@4 + axios
- API: snake_case, пагинация offset/limit, поле has_more
- Product list: GET /v1/public/products?offset=N&limit=N → { items, has_more }
- Product detail: GET /v1/public/products/:id → ProductDetail
- Admin auth: POST /v1/admin/auth/login → { token } (предположительно, уточнить)
- принятые решения:
  - axios + интерсептор для Bearer токена из localStorage (key: admin_token)
  - Алиас `@` → src/
  - Детализация — страница /product/:id
  - LIMIT каталога = 20
  - useInfiniteScroll принимает loading ref
- текущие проблемы: нет

## Лог сессий
- [2026-03-27] Фаза 1 — Настройка проекта. Полностью выполнена.
- [2026-03-27] Фаза 2 — Entities и shared. Типы, API, UI-компоненты.
- [2026-03-27] Фаза 3 — Каталог. Карточки, infinite scroll. Проверено в браузере.
- [2026-03-27] Фаза 4 — Детализация. ProductPage, OffersTable с сортировкой. Сборка чистая.
