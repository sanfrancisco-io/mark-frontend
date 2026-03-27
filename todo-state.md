# TODO STATE — marketplace-frontend

## Последняя выполненная задача
Фаза 2 — Entities и shared (2026-03-27) ✅
- entities/product/model/types.ts — типы Product, ProductDetail, Offer, Seller, ProductsResponse
- entities/product/api — getProducts(offset, limit), getProduct(id)
- shared/ui — AppSpinner, AppButton, AppBadge

## Следующая задача
Фаза 3: Главная страница (каталог)

## Контекст
- стек: Vue 3 + TypeScript + Vite + vue-router@4 + axios
- API: snake_case, пагинация offset/limit, поле has_more
- Product list: GET /v1/public/products?offset=N&limit=N → { items, has_more }
- Product detail: GET /v1/public/products/:id → ProductDetail
- принятые решения:
  - axios + интерсептор для Bearer токена из localStorage (key: admin_token)
  - Алиас `@` → src/
- текущие проблемы: нет

## Лог сессий
- [2026-03-27] Фаза 1 — Настройка проекта. Полностью выполнена, проверена в браузере.
- [2026-03-27] Фаза 2 — Entities и shared. Типы, API-функции, UI-компоненты. Сборка чистая.
