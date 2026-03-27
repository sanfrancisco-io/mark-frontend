# TODO STATE — marketplace-frontend

## Последняя выполненная задача
Фаза 3 — Главная страница (каталог) (2026-03-27)
- widgets/product-card/ui/ProductCard.vue — карточка: фото, название, цена, остаток, дата доставки
- features/infinite-scroll/useInfiniteScroll.ts — composable на IntersectionObserver (rootMargin 200px)
- pages/catalog/model/useCatalog.ts — управление состоянием: products, loading, hasMore, offset
- pages/catalog/ui/CatalogPage.vue — сетка + sentinel + AppSpinner + сообщение «Все товары загружены»
- Сборка чистая

Осталось проверить вручную: infinite scroll работает с реальными данными

## Следующая задача
Фаза 4: Карточка товара (детализация)
- pages/product/ui — страница /product/:id
- Основное изображение товара
- Атрибуты товара (таблица ключ-значение)
- widgets/offers-list — список offers: продавец, рейтинг, цена, дата
- Кнопки сортировки: по цене / по дате доставки (по умолчанию — по цене)

## Контекст
- стек: Vue 3 + TypeScript + Vite + vue-router@4 + axios
- API: snake_case, пагинация offset/limit, поле has_more
- Product list: GET /v1/public/products?offset=N&limit=N → { items, has_more }
- Product detail: GET /v1/public/products/:id → ProductDetail
- принятые решения:
  - axios + интерсептор для Bearer токена из localStorage (key: admin_token)
  - Алиас `@` → src/
  - Детализация товара — отдельная страница /product/:id (не модалка)
  - LIMIT для каталога = 20
- текущие проблемы: нет

## Лог сессий
- [2026-03-27] Фаза 1 — Настройка проекта. Полностью выполнена, проверена в браузере.
- [2026-03-27] Фаза 2 — Entities и shared. Типы, API-функции, UI-компоненты. Сборка чистая.
- [2026-03-27] Фаза 3 — Каталог. ProductCard, useInfiniteScroll, useCatalog, CatalogPage. Сборка чистая.
